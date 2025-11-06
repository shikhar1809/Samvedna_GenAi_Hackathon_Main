import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'

const PRESET_GROUPS = [
  { name: 'Anxiety Support', description: 'A safe space for those dealing with anxiety', category: 'Anxiety' },
  { name: 'Depression Warriors', description: 'Support for managing depression', category: 'Depression' },
  { name: 'PTSD Recovery', description: 'Healing from trauma together', category: 'PTSD' },
  { name: 'Mindfulness Circle', description: 'Practice mindfulness and meditation', category: 'General' },
]

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([])
  const [myGroups, setMyGroups] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Fetch or create preset groups
        const { data: existingGroups } = await supabase
          .from('groups')
          .select('*')

        if (!existingGroups || existingGroups.length === 0) {
          // Create preset groups
          await supabase.from('groups').insert(PRESET_GROUPS as any)
          const { data } = await supabase.from('groups').select('*')
          setGroups(data || [])
        } else {
          setGroups(existingGroups)
        }

        // Fetch user's groups
        if (user) {
          const { data: memberships } = await supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', user.id)

          setMyGroups(new Set((memberships as any[])?.map((m: any) => m.group_id) || []))
        }
      } catch (error) {
        console.error('Error fetching groups:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [user])

  const handleJoin = async (groupId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member',
        } as any)

      if (error) throw error

      setMyGroups(prev => new Set(prev).add(groupId))
    } catch (error: any) {
      alert('Error joining group: ' + error.message)
    }
  }

  const handleLeave = async (groupId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id)

      if (error) throw error

      const newMyGroups = new Set(myGroups)
      newMyGroups.delete(groupId)
      setMyGroups(newMyGroups)
    } catch (error: any) {
      alert('Error leaving group: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Support Groups</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Join a Support Community</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {groups.map((group) => (
                <div key={group.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {group.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {group.member_count || 0} members
                    </span>
                    {myGroups.has(group.id) ? (
                      <button
                        onClick={() => handleLeave(group.id)}
                        className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors text-sm"
                      >
                        Leave Group
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoin(group.id)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                      >
                        Join Group
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


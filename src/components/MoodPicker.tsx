interface MoodPickerProps {
  value: number
  onChange: (value: number) => void
}

const moods = [
  { value: 1, emoji: '😢', label: 'Terrible' },
  { value: 2, emoji: '😟', label: 'Bad' },
  { value: 3, emoji: '😕', label: 'Not Great' },
  { value: 4, emoji: '😐', label: 'Okay' },
  { value: 5, emoji: '🙂', label: 'Fine' },
  { value: 6, emoji: '😊', label: 'Good' },
  { value: 7, emoji: '😃', label: 'Great' },
  { value: 8, emoji: '😄', label: 'Very Good' },
  { value: 9, emoji: '🤗', label: 'Excellent' },
  { value: 10, emoji: '🎉', label: 'Amazing' },
]

export default function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">
        How are you feeling today?
      </label>
      
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
              value === mood.value
                ? 'border-primary bg-primary/10 scale-105'
                : 'border-border hover:border-primary/50'
            }`}
            title={mood.label}
          >
            <div className="text-2xl">{mood.emoji}</div>
            <div className="text-xs mt-1">{mood.value}</div>
          </button>
        ))}
      </div>

      {value > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          You're feeling: <span className="font-medium">{moods[value - 1].label}</span>
        </p>
      )}
    </div>
  )
}


import { Label } from '@/components/ui/label'

const InputField = ({name, label, placeholder,type="text", register, error, validation, disabled, value}: FormInputProps) => {
  return (
    <div className='space-y-2'>
        <Label htmlFor={name} className="form-label">
            {label}
        </Label>
        <input 
            type={type}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            className={`form-input${disabled ? ' opacity-50 cursor-not-allowed' : ''}`}
            {...register(name, validation)}
        />
        
        {error && <p className='text-sm text-red-500'>{error.message}</p>}
        </div>
  )
}

export default InputField
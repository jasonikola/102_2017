import React, { useRef, useState } from 'react';

type NumberInputProps = {
  onChange: (value: number) => void
}

const NumberInput: React.FC<NumberInputProps> = ({ onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(0);

  const handleChange = (e: any) => {
    const newValue: number = Math.max(0, parseInt(e.target.value));
    setValue(newValue);
    onChange(newValue);
  };

  const handleBlur = () => {
    if (!value) {
      setValue(0);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === 'Escape' || event.key === 'Enter') && inputRef.current) {
      inputRef.current?.blur();
    }
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        ref={inputRef}
        min={0}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{ width: '50px' }}
      />
    </div>
  );
};

export default NumberInput;

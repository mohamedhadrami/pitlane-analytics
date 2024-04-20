// components/DropdownProps.tsx

import React, { ChangeEvent } from "react";
import styles from '../styles/dropdown.module.css';

interface DropdownProps {
  id: string;
  label: string;
  options: any[] | null;
  onChange: (value: any) => void;
  value: any;
  disabled?: boolean;
}

const mapOptions = (dropdownId: string, data: any[] | null) => {
  switch (dropdownId) {
    case 'race':
      return data?.map((meeting) => ({ id: meeting.meeting_key, name: meeting.meeting_name })) || [];
    case 'session':
      return data?.map((session) => ({ id: session.session_key, name: session.session_name })) || [];
    case 'driver':
      return data?.map((driver) => ({ id: driver.driver_number, name: driver.full_name })) || [];
    case 'lap':
      return data?.map((lap) => ({ id: lap.lap_number, name: `${lap.lap_number}. ${lap.lap_duration}s` })) || [];
    default:
      return data || [];
  }
};

const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  options,
  onChange,
  value,
  disabled = false,
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
  };

  return (
    <div className="dropdown" id={`${id}-select`}>
      <select
        id={`${id}Select`}
        className="select"
        onChange={handleChange}
        disabled={disabled}
        value={value || ""}
      >
        <option value="" className="option" disabled>
          Select a {label.toLowerCase()}
        </option>
        {mapOptions(id, options).map((option) => (
          <option key={option.id} value={option.id} className="option">
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

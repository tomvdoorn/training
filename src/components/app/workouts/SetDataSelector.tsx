import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

type SetDataOption = 'lastSession' | 'prSession' | 'template';

interface SetDataSelectorProps {
  value: SetDataOption;
  onChange: (value: SetDataOption) => void;
}

const SetDataSelector: React.FC<SetDataSelectorProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select data source" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="lastSession">Last Session</SelectItem>
        <SelectItem value="prSession">PR Session</SelectItem>
        <SelectItem value="template">Template</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SetDataSelector;


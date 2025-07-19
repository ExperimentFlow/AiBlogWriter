import React, { useState, useEffect } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Parse defaultValues to array
const parseDefaultValues = (values: string | string[] | undefined): string[] => {
  if (!values) return [];
  if (Array.isArray(values)) return values;
  try {
    return JSON.parse(values);
  } catch {
    return [];
  }
};

interface OptionsManagerProps {
  options: string;
  onChange: (options: string) => void;
  fieldType?: 'radio' | 'select' | 'checkbox';
  defaultValue?: string; // for radio/select
  defaultValues?: string | string[]; // for checkbox (can be string or array)
  onDefaultChange?: (value: string | string[]) => void;
}

const SortableOption: React.FC<{
  id: string;
  index: number;
  option: string;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  fieldType?: 'radio' | 'select' | 'checkbox';
  defaultValue?: string;
  defaultValues?: string | string[];
  onDefaultChange?: (value: string | string[]) => void;
}> = ({ id, index, option, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast, fieldType, defaultValue, defaultValues, onDefaultChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#f3f4f6' : undefined,
  };

  // Default checked logic
  const parsedDefaultValues = parseDefaultValues(defaultValues);
  const isDefault = fieldType === 'checkbox'
    ? parsedDefaultValues.includes(option)
    : defaultValue === option;

  const handleDefaultChange = () => {
    if (!onDefaultChange) return;
    if (fieldType === 'checkbox') {
      let newDefaults = Array.isArray(defaultValues) ? [...defaultValues] : [];
      if (isDefault) {
        newDefaults = newDefaults.filter(v => v !== option);
      } else {
        newDefaults.push(option);
      }
      onDefaultChange(newDefaults);
    } else {
      onDefaultChange(option);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 group">
      {/* Drag handle */}
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600 transition-colors cursor-grab"
        title="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      {/* Option input */}
      <input
        type="text"
        value={option}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Option ${index + 1}`}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* Default checked/selected control */}
      {fieldType === 'radio' || fieldType === 'select' ? (
        <input
          type="radio"
          name="default-radio-option"
          checked={isDefault}
          onChange={handleDefaultChange}
          title="Set as default"
        />
      ) : fieldType === 'checkbox' ? (
        <input
          type="checkbox"
          checked={isDefault}
          onChange={handleDefaultChange}
          title="Set as default checked"
        />
      ) : null}
      {/* Move up button */}
      {!isFirst && (
        <button
          type="button"
          onClick={onMoveUp}
          className="text-gray-400 hover:text-blue-600 transition-colors"
          title="Move up"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
      {/* Move down button */}
      {!isLast && (
        <button
          type="button"
          onClick={onMoveDown}
          className="text-gray-400 hover:text-blue-600 transition-colors"
          title="Move down"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Remove option"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const OptionsManager: React.FC<OptionsManagerProps> = ({ options, onChange, fieldType, defaultValue, defaultValues, onDefaultChange }) => {
  // Parse options from string (newline-separated) to array
  const parseOptions = (optionsStr: string): string[] => {
    if (!optionsStr) return [];
    return optionsStr.split('\n').filter(option => option.trim() || option === '');
  };

  // Convert array back to string
  const stringifyOptions = (optionsArray: string[]): string => {
    return optionsArray.join('\n');
  };

  const [optionsList, setOptionsList] = useState<string[]>(parseOptions(options));

  // Update local state when options prop changes
  useEffect(() => {
    setOptionsList(parseOptions(options));
  }, [options]);

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const addOption = () => {
    const newOptions = [...optionsList, ''];
    setOptionsList(newOptions);
    onChange(stringifyOptions(newOptions));
  };

  const removeOption = (index: number) => {
    const newOptions = optionsList.filter((_, i) => i !== index);
    setOptionsList(newOptions);
    onChange(stringifyOptions(newOptions));
    // Also update default if needed
    if (fieldType === 'radio' || fieldType === 'select') {
      if (defaultValue === optionsList[index] && onDefaultChange) {
        onDefaultChange('');
      }
    } else if (fieldType === 'checkbox') {
      const parsedDefaults = parseDefaultValues(defaultValues);
      if (parsedDefaults.includes(optionsList[index]) && onDefaultChange) {
        onDefaultChange(parsedDefaults.filter(v => v !== optionsList[index]));
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...optionsList];
    newOptions[index] = value;
    setOptionsList(newOptions);
    onChange(stringifyOptions(newOptions));
    // If the default was the old value, update it to the new value
    if (fieldType === 'radio' || fieldType === 'select') {
      if (defaultValue === optionsList[index] && onDefaultChange) {
        onDefaultChange(value);
      }
    } else if (fieldType === 'checkbox') {
      const parsedDefaults = parseDefaultValues(defaultValues);
      if (parsedDefaults.includes(optionsList[index]) && onDefaultChange) {
        onDefaultChange([
          ...parsedDefaults.filter(v => v !== optionsList[index]),
          value
        ]);
      }
    }
  };

  const moveOption = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= optionsList.length) return;
    const newOptions = [...optionsList];
    const [movedOption] = newOptions.splice(fromIndex, 1);
    newOptions.splice(toIndex, 0, movedOption);
    setOptionsList(newOptions);
    onChange(stringifyOptions(newOptions));
    // Also reorder defaults for checkbox if needed
    if (fieldType === 'checkbox' && defaultValues && onDefaultChange) {
      const parsedDefaults = parseDefaultValues(defaultValues);
      const newDefaults = parsedDefaults.map(v => {
        const oldIdx = optionsList.indexOf(v);
        return oldIdx !== -1 ? newOptions[oldIdx] : v;
      });
      onDefaultChange(newDefaults);
    }
    // For radio/select, no need to update default as value is unique
  };

  // Handle drag end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = optionsList.findIndex((_, i) => `option-${i}` === active.id);
    const newIndex = optionsList.findIndex((_, i) => `option-${i}` === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      moveOption(oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-2">
      {optionsList.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm border-2 border-dashed border-gray-300 rounded-md">
          No options added yet
        </div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={optionsList.map((_, i) => `option-${i}`)} strategy={verticalListSortingStrategy}>
          {optionsList.map((option, index) => (
            <SortableOption
              key={`option-${index}`}
              id={`option-${index}`}
              index={index}
              option={option}
              onChange={updateOption}
              onRemove={removeOption}
              onMoveUp={() => moveOption(index, index - 1)}
              onMoveDown={() => moveOption(index, index + 1)}
              isFirst={index === 0}
              isLast={index === optionsList.length - 1}
              fieldType={fieldType}
              defaultValue={defaultValue}
              defaultValues={defaultValues}
              onDefaultChange={onDefaultChange}
            />
          ))}
        </SortableContext>
      </DndContext>
      {/* Add option button */}
      <button
        type="button"
        onClick={addOption}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 border-dashed rounded-md text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Option
      </button>
    </div>
  );
}; 
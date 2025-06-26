'use client';

import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Trash2, Settings, Plus, X, Eye } from 'lucide-react';

interface FormBuilderProps {
  fields: FormField[];
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  onRemoveField: (id: string) => void;
  selectedField: FormField | null;
  onSelectField: (field: FormField | null) => void;
}

interface SortableFieldProps {
  field: FormField;
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  onRemoveField: (id: string) => void;
  onSelectField: (field: FormField) => void;
  isSelected: boolean;
}

function SortableField({ field, onUpdateField, onRemoveField, onSelectField, isSelected }: SortableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderFieldPreview = () => {
    const baseInputProps = {
      placeholder: field.placeholder,
      disabled: true,
      className: "w-full"
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
      case 'search':
        return <Input type={field.type} {...baseInputProps} />;
      
      case 'number':
      case 'range':
        return <Input type={field.type} {...baseInputProps} />;
      
      case 'textarea':
        return <Textarea {...baseInputProps} />;
      
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" disabled />
                <Label className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <Label className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
        );
      
      case 'date':
      case 'time':
      case 'datetime-local':
      case 'month':
      case 'week':
        return <Input type={field.type} {...baseInputProps} />;
      
      case 'file':
        return <Input type="file" disabled />;
      
      case 'color':
        return <Input type="color" disabled />;
      
      default:
        return <Input {...baseInputProps} />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''} mb-4`}
    >
      <Card className={`relative group cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`} onClick={() => onSelectField(field)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab hover:cursor-grabbing p-1"
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
              <Badge variant="outline">{field.type}</Badge>
              <CardTitle className="text-lg">
                {isEditing ? (
                  <Input
                    value={field.label}
                    onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
                    onBlur={() => setIsEditing(false)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span 
                    className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                  >
                    {field.label}
                  </span>
                )}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectField(field);
                }}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveField(field.id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Field Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
            {renderFieldPreview()}
            
            {field.helpText && (
              <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function FormBuilder({
  fields,
  onUpdateField,
  onRemoveField,
  selectedField,
  onSelectField
}: FormBuilderProps) {
  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Form Fields ({fields.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No fields added yet. Drag elements from the left sidebar to build your form.</p>
            </div>
          ) : (
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  onUpdateField={onUpdateField}
                  onRemoveField={onRemoveField}
                  onSelectField={onSelectField}
                  isSelected={selectedField?.id === field.id}
                />
              ))}
            </SortableContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
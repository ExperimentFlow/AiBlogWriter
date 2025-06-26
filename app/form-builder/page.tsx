'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormBuilder } from './components/form-builder';
import { FormPreview } from './components/form-preview';
import { FormField, FormFieldType } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Download, Eye, Settings, Plus, Trash2, X } from 'lucide-react';

export default function FormBuilderPage() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [activeField, setActiveField] = useState<FormField | null>(null);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedField = fields.find(field => field.id === active.id);
    setActiveField(draggedField || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveField(null);

    if (over && active.id !== over.id) {
      // Check if this is a field reorder or a new field being added
      const isNewField = !fields.find(field => field.id === active.id);
      
      if (isNewField) {
        // Adding a new field from the sidebar
        const fieldType = active.id as FormFieldType;
        addField(fieldType);
      } else {
        // Reordering existing fields
        setFields(fields => {
          const oldIndex = fields.findIndex(field => field.id === active.id);
          const newIndex = fields.findIndex(field => field.id === over.id);

          const newFields = [...fields];
          const [removed] = newFields.splice(oldIndex, 1);
          newFields.splice(newIndex, 0, removed);

          return newFields;
        });
      }
    }
  };

  const addField = (fieldType: FormFieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType}`,
      placeholder: `Enter ${fieldType}`,
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? ['Option 1', 'Option 2'] : [],
      validation: {
        minLength: 0,
        maxLength: 100,
        pattern: ''
      }
    };
    setFields([...fields, newField]);
    setSelectedField(newField);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
    
    // Update selected field if it's the one being edited
    if (selectedField && selectedField.id === id) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    if (selectedField && selectedField.id === id) {
      setSelectedField(null);
    }
  };

  const exportForm = () => {
    const formData = {
      fields: fields
    };
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: '📝', description: 'Single line text input' },
    { type: 'textarea', label: 'Text Area', icon: '📄', description: 'Multi-line text input' },
    { type: 'email', label: 'Email', icon: '📧', description: 'Email address input' },
    { type: 'number', label: 'Number', icon: '🔢', description: 'Numeric input' },
    { type: 'tel', label: 'Phone', icon: '📞', description: 'Phone number input' },
    { type: 'url', label: 'URL', icon: '🔗', description: 'Website URL input' },
    { type: 'password', label: 'Password', icon: '🔒', description: 'Password input' },
    { type: 'select', label: 'Dropdown', icon: '📋', description: 'Select from options' },
    { type: 'radio', label: 'Radio Buttons', icon: '🔘', description: 'Single choice options' },
    { type: 'checkbox', label: 'Checkboxes', icon: '☑️', description: 'Multiple choice options' },
    { type: 'date', label: 'Date Picker', icon: '📅', description: 'Date selection' },
    { type: 'time', label: 'Time Picker', icon: '⏰', description: 'Time selection' },
    { type: 'datetime-local', label: 'Date & Time', icon: '📅⏰', description: 'Date and time selection' },
    { type: 'file', label: 'File Upload', icon: '📁', description: 'File upload input' },
    { type: 'color', label: 'Color Picker', icon: '🎨', description: 'Color selection' },
    { type: 'range', label: 'Range Slider', icon: '📊', description: 'Range value input' },
    { type: 'search', label: 'Search', icon: '🔍', description: 'Search input' },
    { type: 'month', label: 'Month', icon: '📆', description: 'Month selection' },
    { type: 'week', label: 'Week', icon: '📅', description: 'Week selection' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Form Builder</h1>
          <p className="text-gray-600">Drag elements from the left to build your form</p>
        </div>

        {showPreview ? (
          <FormPreview fields={fields} config={{ title: 'My Form', description: '', submitButtonText: 'Submit', successMessage: 'Thank you!' }} />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              {/* Left Sidebar - Draggable Form Elements */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Form Elements
                    </CardTitle>
                    <CardDescription>Click to add to form</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[70vh] overflow-y-auto">
                    {fieldTypes.map((fieldType) => (
                      <Button
                        key={fieldType.type}
                        variant="outline"
                        className="w-full justify-start gap-3 h-auto p-3 text-left"
                        onClick={() => addField(fieldType.type as FormFieldType)}
                      >
                        <span className="text-lg">{fieldType.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{fieldType.label}</div>
                          <div className="text-xs text-gray-500">{fieldType.description}</div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Middle - Form Builder Area */}
              <div className="lg:col-span-4">
                <FormBuilder
                  fields={fields}
                  onUpdateField={updateField}
                  onRemoveField={removeField}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
                <DragOverlay>
                  {activeField ? (
                    <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg">
                      {activeField.label}
                    </div>
                  ) : null}
                </DragOverlay>
              </div>

              {/* Right Sidebar - Field Options */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Field Options
                    </CardTitle>
                    <CardDescription>Configure selected field</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                    {selectedField ? (
                      <FieldOptions
                        field={selectedField}
                        onUpdateField={updateField}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Settings className="w-8 h-8 mx-auto mb-2" />
                        <p>Select a field to configure</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </DndContext>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => setShowPreview(!showPreview)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button onClick={exportForm}>
            <Download className="w-4 h-4 mr-2" />
            Export Form
          </Button>
        </div>
      </div>
    </div>
  );
}

// Field Options Component
function FieldOptions({ field, onUpdateField }: { field: FormField; onUpdateField: (id: string, updates: Partial<FormField>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Field Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Placeholder</label>
        <input
          type="text"
          value={field.placeholder || ''}
          onChange={(e) => onUpdateField(field.id, { placeholder: e.target.value })}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Help Text</label>
        <input
          type="text"
          value={field.helpText || ''}
          onChange={(e) => onUpdateField(field.id, { helpText: e.target.value })}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="required"
          checked={field.required}
          onChange={(e) => onUpdateField(field.id, { required: e.target.checked })}
          className="rounded"
        />
        <label htmlFor="required" className="text-sm">Required field</label>
      </div>

      {/* Options for select, radio, checkbox */}
      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
        <div>
          <label className="text-sm font-medium">Options</label>
          <div className="space-y-2 mt-2">
            {field.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(field.options || [])];
                    newOptions[index] = e.target.value;
                    onUpdateField(field.id, { options: newOptions });
                  }}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => {
                    const newOptions = field.options?.filter((_: string, i: number) => i !== index) || [];
                    onUpdateField(field.id, { options: newOptions });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                onUpdateField(field.id, { options: newOptions });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              + Add Option
            </button>
          </div>
        </div>
      )}

      {/* Validation settings */}
      <div>
        <label className="text-sm font-medium">Validation</label>
        <div className="space-y-2 mt-2">
          <div>
            <label className="text-xs">Min Length</label>
            <input
              type="number"
              value={field.validation.minLength || ''}
              onChange={(e) => onUpdateField(field.id, {
                validation: { ...field.validation, minLength: parseInt(e.target.value) || undefined }
              })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-xs">Max Length</label>
            <input
              type="number"
              value={field.validation.maxLength || ''}
              onChange={(e) => onUpdateField(field.id, {
                validation: { ...field.validation, maxLength: parseInt(e.target.value) || undefined }
              })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          {(field.type === 'number' || field.type === 'range') && (
            <>
              <div>
                <label className="text-xs">Min Value</label>
                <input
                  type="number"
                  value={field.validation.min || ''}
                  onChange={(e) => onUpdateField(field.id, {
                    validation: { ...field.validation, min: parseInt(e.target.value) || undefined }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Max Value</label>
                <input
                  type="number"
                  value={field.validation.max || ''}
                  onChange={(e) => onUpdateField(field.id, {
                    validation: { ...field.validation, max: parseInt(e.target.value) || undefined }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs">Step</label>
                <input
                  type="number"
                  value={field.validation.step || ''}
                  onChange={(e) => onUpdateField(field.id, {
                    validation: { ...field.validation, step: parseInt(e.target.value) || undefined }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
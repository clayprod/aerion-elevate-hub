import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";

interface ArrayEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, onChange: (item: T) => void, onDelete: () => void) => React.ReactNode;
  onAdd: () => T;
  title?: string;
  addButtonText?: string;
}

export function ArrayEditor<T extends { id?: string }>({
  items,
  onChange,
  renderItem,
  onAdd,
  title,
  addButtonText = "Adicionar Item",
}: ArrayEditorProps<T>) {
  const handleAdd = () => {
    const newItem = onAdd();
    onChange([...items, { ...newItem, id: `temp-${Date.now()}` }]);
  };

  const handleDelete = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, updatedItem: T) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-navy-deep">{title}</h3>}
      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={item.id || index} className="p-4">
            {renderItem(item, index, (updated) => handleItemChange(index, updated), () => handleDelete(index))}
          </Card>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={handleAdd} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        {addButtonText}
      </Button>
    </div>
  );
}

// Helper component for editing string arrays
export function StringArrayEditor({
  items,
  onChange,
  label,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  label?: string;
  placeholder?: string;
}) {
  return (
    <ArrayEditor
      items={items.map((item, idx) => ({ id: `item-${idx}`, value: item }))}
      onChange={(newItems) => onChange(newItems.map((item: any) => item.value))}
      onAdd={() => ({ id: `new-${Date.now()}`, value: "" })}
      title={label}
      addButtonText="Adicionar"
      renderItem={(item: any, index, onChangeItem, onDelete) => (
        <div className="flex gap-2">
          <Input
            value={item.value}
            onChange={(e) => onChangeItem({ ...item, value: e.target.value })}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    />
  );
}







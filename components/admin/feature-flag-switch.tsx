'use client';

import { useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { updateFeatureFlag } from '@/lib/actions/feature-flags';

interface FeatureFlagSwitchProps {
  flagKey: string;
  field: 'isActive' | 'ownerVisible' | 'ownerEditable' | 'publicVisible';
  initialValue: boolean;
  disabled?: boolean;
}

export function FeatureFlagSwitch({ flagKey, field, initialValue, disabled = false }: FeatureFlagSwitchProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const result = await updateFeatureFlag({
        key: flagKey,
        field,
        value: checked
      });

      if (result.success) {
        toast.success(result.message || 'Actualizado exitosamente');
      } else {
        toast.error(result.error || 'Error al actualizar flag');
      }
    });
  };

  return (
    <Switch 
      checked={initialValue} 
      onCheckedChange={handleToggle} 
      disabled={isPending || disabled} 
      className="data-[state=checked]:bg-[#ea580c]"
    />
  );
}

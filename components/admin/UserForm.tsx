'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, CreateUserPayload, UpdateUserPayload } from '@/lib/adminApi';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>;
  user?: User | null; // If provided, it's edit mode
  companies?: Array<{ id: string; name: string }>; // For company selection
  isLoading?: boolean;
}

export function UserForm({
  isOpen,
  onClose,
  onSubmit,
  user = null,
  companies = [],
  isLoading = false
}: UserFormProps) {
  const isEdit = !!user;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'staff_user',
    company_id: '',
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      // Edit mode - populate form with user data
      setFormData({
        email: user.email,
        password: '', // Don't populate password for security
        full_name: user.full_name,
        role: user.role,
        company_id: user.company_id || '',
        is_active: user.is_active
      });
    } else {
      // Create mode - reset form
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'viewer',
        company_id: '',
        is_active: true
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!isEdit && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!isEdit && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!['super_admin', 'owner', 'viewer'].includes(formData.role)) {
      newErrors.role = 'Invalid role selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = isEdit
        ? {
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          company_id: formData.company_id || undefined,
          is_active: formData.is_active
        } as UpdateUserPayload
        : {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role,
          company_id: formData.company_id || undefined,
          is_active: formData.is_active
        } as CreateUserPayload;

      await onSubmit(submitData);
      onClose();
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setErrors({ submit: error.response.data.detail });
      } else {
        setErrors({ submit: 'An error occurred while saving the user' });
      }
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit User' : 'Create New User'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update user information and permissions.'
              : 'Add a new user to the system with appropriate role and permissions.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {errors.submit && (
              <Alert variant="destructive">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {!isEdit && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <div className="col-span-3">
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={errors.password ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Full Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className={errors.full_name ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500 mt-1">{errors.full_name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Platform Admin</SelectItem>
                    <SelectItem value="owner">Company Owner</SelectItem>
                    <SelectItem value="viewer">Company Viewer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500 mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {companies.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.company_id ?? "__NONE__"}
                    onValueChange={(value) => handleInputChange("company_id", value === "__NONE__" ? "" : value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__NONE__">No company</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">
                Active
              </Label>
              <div className="col-span-3">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

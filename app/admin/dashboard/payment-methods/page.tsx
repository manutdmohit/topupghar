'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Power,
  CreditCard,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import type { PaymentMethodDto } from '@/lib/payment-methods';

type FormState = {
  name: string;
  slug: string;
  description: string;
  qrImage: string;
  instructions: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyForm: FormState = {
  name: '',
  slug: '',
  description: '',
  qrImage: '',
  instructions:
    'Scan the QR code and upload your payment receipt after completing the transaction.',
  sortOrder: '0',
  isActive: true,
};

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethodDto | null>(
    null,
  );
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/payment-methods?status=${statusFilter}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch payment methods');
      }

      setPaymentMethods(data.paymentMethods || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to fetch payment methods',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [statusFilter]);

  const openCreateModal = () => {
    setEditingMethod(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (method: PaymentMethodDto) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      slug: method.slug,
      description: method.description || '',
      qrImage: method.qrImage,
      instructions: method.instructions || '',
      sortOrder: String(method.sortOrder ?? 0),
      isActive: method.isActive,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setFormData((prev) => ({ ...prev, qrImage: data.url }));
      toast.success('QR image uploaded');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image',
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        qrImage: formData.qrImage,
        instructions: formData.instructions,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive,
      };

      const response = await fetch(
        editingMethod
          ? `/api/admin/payment-methods/${editingMethod._id}`
          : '/api/admin/payment-methods',
        {
          method: editingMethod ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save payment method');
      }

      toast.success(data.message);
      setShowModal(false);
      fetchPaymentMethods();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save payment method',
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (method: PaymentMethodDto) => {
    try {
      const response = await fetch(`/api/admin/payment-methods/${method._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !method.isActive }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      toast.success(data.message);
      fetchPaymentMethods();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update status',
      );
    }
  };

  const deleteMethod = async (method: PaymentMethodDto) => {
    if (
      !confirm(
        `Delete "${method.name}"? Existing orders using this method will keep their stored value.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/payment-methods/${method._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete payment method');
      }

      toast.success(data.message);
      fetchPaymentMethods();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete payment method',
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-blue-600" />
            Payment Methods
          </h1>
          <p className="text-gray-600 mt-1">
            Manage Khalti, eSewa, bank QR, and other payment options shown on
            checkout and wallet top-up.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Payment Method
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'active', 'inactive'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : paymentMethods.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No payment methods found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentMethods.map((method) => (
                  <tr key={method._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={method.qrImage}
                          alt={method.name}
                          className="w-12 h-12 object-contain rounded border bg-white"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {method.name}
                          </p>
                          {method.description && (
                            <p className="text-sm text-gray-500">
                              {method.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {method.slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {method.sortOrder}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          method.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {method.isActive ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(method)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(method)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                          title={method.isActive ? 'Disable' : 'Enable'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMethod(method)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="eSewa"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="esewa"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Stored on orders. Use lowercase, e.g. esewa, khalti, bank
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Digital wallet & payment gateway"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Image *
                </label>
                <div className="flex gap-3">
                  <input
                    value={formData.qrImage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        qrImage: e.target.value,
                      }))
                    }
                    placeholder="/esewa.jpg or uploaded URL"
                    className="flex-1 px-4 py-2 border rounded-lg"
                    required
                  />
                  <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {formData.qrImage && (
                  <img
                    src={formData.qrImage}
                    alt="Preview"
                    className="mt-3 w-32 h-32 object-contain border rounded-lg"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sortOrder: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <label className="flex items-center gap-2 mt-7">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingMethod ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

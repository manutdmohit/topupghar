'use client';

import {
  CHECKOUT_IDENTIFIER_OPTIONS,
  DEFAULT_CHECKOUT,
  type ProductCheckoutConfig,
} from '@/lib/checkout-config';

interface CheckoutConfigFormProps {
  value: ProductCheckoutConfig;
  onChange: (checkout: ProductCheckoutConfig) => void;
}

export function CheckoutConfigForm({ value, onChange }: CheckoutConfigFormProps) {
  const checkout = { ...DEFAULT_CHECKOUT, ...value };

  const update = (patch: Partial<ProductCheckoutConfig>) => {
    onChange({ ...checkout, ...patch });
  };

  const selectedOption = CHECKOUT_IDENTIFIER_OPTIONS.find(
    (option) => option.value === checkout.identifier,
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer identifier field <span className="text-red-500">*</span>
        </label>
        <select
          value={checkout.identifier}
          onChange={(e) =>
            update({
              identifier: e.target.value as ProductCheckoutConfig['identifier'],
              requiresSocialLogin: e.target.value === 'none',
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {CHECKOUT_IDENTIFIER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {selectedOption && (
          <p className="text-xs text-gray-500 mt-1">{selectedOption.description}</p>
        )}
      </div>

      {checkout.identifier !== 'none' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom label (optional)
            </label>
            <input
              type="text"
              value={checkout.identifierLabel || ''}
              onChange={(e) => update({ identifierLabel: e.target.value })}
              placeholder="e.g. PUBG Player ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom placeholder (optional)
            </label>
            <input
              type="text"
              value={checkout.identifierPlaceholder || ''}
              onChange={(e) => update({ identifierPlaceholder: e.target.value })}
              placeholder="e.g. Enter your PUBG ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checkout.requiresAccountPassword ?? false}
            onChange={(e) =>
              update({ requiresAccountPassword: e.target.checked })
            }
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            Requires account password (e.g. Garena)
          </span>
        </label>

        {checkout.requiresAccountPassword && (
          <input
            type="text"
            value={checkout.accountPasswordLabel || ''}
            onChange={(e) => update({ accountPasswordLabel: e.target.value })}
            placeholder="Password field label (default: Account Password)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checkout.requiresServicePassword ?? false}
            onChange={(e) =>
              update({ requiresServicePassword: e.target.checked })
            }
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            Requires service password (e.g. Konami)
          </span>
        </label>

        {checkout.requiresServicePassword && (
          <input
            type="text"
            value={checkout.servicePasswordLabel || ''}
            onChange={(e) => update({ servicePasswordLabel: e.target.value })}
            placeholder="Service password label (default: Service Password)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checkout.requiresSocialLogin ?? false}
            onChange={(e) =>
              update({
                requiresSocialLogin: e.target.checked,
                identifier: e.target.checked ? 'none' : checkout.identifier,
              })
            }
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            Requires social login (ID + password + Google/Facebook)
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checkout.requiresSeparateZone ?? false}
            onChange={(e) =>
              update({ requiresSeparateZone: e.target.checked })
            }
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            Requires separate zone field (e.g. MLBB)
          </span>
        </label>

        {checkout.requiresSeparateZone && (
          <input
            type="text"
            value={checkout.zoneLabel || ''}
            onChange={(e) => update({ zoneLabel: e.target.value })}
            placeholder="Zone field label (default: Zone)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        )}
      </div>
    </div>
  );
}

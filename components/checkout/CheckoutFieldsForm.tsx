'use client';

import {
  getIdentifierFieldMeta,
  type ProductCheckoutConfig,
} from '@/lib/checkout-config';

export interface CheckoutFieldValues {
  uid: string;
  phone: string;
  password: string;
  servicePassword: string;
  loginId: string;
  tiktokPassword: string;
  loginMethod: 'google' | 'facebook' | '';
  zone: string;
}

interface CheckoutFieldsFormProps {
  checkout: ProductCheckoutConfig;
  values: CheckoutFieldValues;
  onChange: (field: keyof CheckoutFieldValues, value: string) => void;
}

function OptionalLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block mb-1 font-medium text-gray-700">
      {children}
      <span className="text-gray-500 font-normal"> (optional)</span>
    </label>
  );
}

export function CheckoutFieldsForm({
  checkout,
  values,
  onChange,
}: CheckoutFieldsFormProps) {
  const identifierMeta = getIdentifierFieldMeta(checkout);

  return (
    <div className="space-y-4">
      {checkout.requiresSocialLogin && (
        <div className="space-y-3">
          <div>
            <OptionalLabel>Login ID</OptionalLabel>
            <input
              type="text"
              placeholder="Enter your login ID"
              value={values.loginId}
              onChange={(e) => onChange('loginId', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <OptionalLabel>Account Password</OptionalLabel>
            <input
              type="password"
              placeholder="Enter your account password"
              value={values.tiktokPassword}
              onChange={(e) => onChange('tiktokPassword', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              autoComplete="current-password"
            />
          </div>
          <div>
            <OptionalLabel>Login Method</OptionalLabel>
            <div className="flex gap-6">
              {(checkout.socialLoginMethods ?? ['google', 'facebook']).map(
                (method) => (
                  <label
                    key={method}
                    className="flex items-center gap-2 cursor-pointer font-medium capitalize"
                  >
                    <input
                      type="radio"
                      value={method}
                      checked={values.loginMethod === method}
                      onChange={() => onChange('loginMethod', method)}
                      className="accent-purple-600"
                    />
                    {method}
                  </label>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {!checkout.requiresSocialLogin && checkout.identifier !== 'none' && (
        <div>
          <OptionalLabel>{identifierMeta.label}</OptionalLabel>
          <input
            type={identifierMeta.inputType}
            placeholder={identifierMeta.placeholder}
            value={values.uid}
            onChange={(e) => onChange('uid', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      )}

      {checkout.requiresAccountPassword && (
        <div>
          <OptionalLabel>
            {checkout.accountPasswordLabel || 'Account Password'}
          </OptionalLabel>
          <input
            type="text"
            placeholder={`Enter your ${checkout.accountPasswordLabel || 'account password'}`}
            value={values.password}
            onChange={(e) => onChange('password', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            autoComplete="off"
          />
        </div>
      )}

      {checkout.requiresServicePassword && (
        <div>
          <OptionalLabel>
            {checkout.servicePasswordLabel || 'Service Password'}
          </OptionalLabel>
          <input
            type="text"
            placeholder={`Enter your ${checkout.servicePasswordLabel || 'service password'}`}
            value={values.servicePassword}
            onChange={(e) => onChange('servicePassword', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            autoComplete="current-password"
          />
        </div>
      )}

      {checkout.customerNote?.trim() && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          {checkout.customerNote.trim()}
        </p>
      )}

      {checkout.requiresSeparateZone && (
        <div>
          <OptionalLabel>{checkout.zoneLabel || 'Zone'}</OptionalLabel>
          <input
            type="text"
            placeholder="Enter your zone"
            value={values.zone}
            onChange={(e) => onChange('zone', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      )}

      <div>
        <OptionalLabel>Phone Number</OptionalLabel>
        <input
          type="tel"
          placeholder="9800000000"
          value={values.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
}

export function validateCheckoutFields(
  checkout: ProductCheckoutConfig,
  values: CheckoutFieldValues,
): string | null {
  const validatePhone = (phone: string) => /^(97|98)\d{8}$/.test(phone);
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (values.phone.trim() && !validatePhone(values.phone)) {
    return 'Please enter a valid Nepali phone number.';
  }

  if (
    checkout.identifier === 'email' &&
    values.uid.trim() &&
    !validateEmail(values.uid)
  ) {
    return 'Please enter a valid email address.';
  }

  return null;
}

export function buildUidEmailForOrder(
  checkout: ProductCheckoutConfig,
  values: CheckoutFieldValues,
): string {
  if (checkout.requiresSocialLogin) {
    return values.loginId;
  }

  if (checkout.identifier === 'gameIdWithZone' || checkout.requiresSeparateZone) {
    return checkout.requiresSeparateZone
      ? `${values.uid} - ${values.zone}`
      : values.uid;
  }

  return values.uid;
}

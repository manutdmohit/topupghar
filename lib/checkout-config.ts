import type { IProduct } from '@/models/Product';

export type CheckoutIdentifierType =
  | 'gameId'
  | 'gameIdWithZone'
  | 'email'
  | 'username'
  | 'postLink'
  | 'channelUrl'
  | 'none';

export type SocialLoginMethod = 'google' | 'facebook';

export interface ProductCheckoutConfig {
  identifier: CheckoutIdentifierType;
  identifierLabel?: string;
  identifierPlaceholder?: string;
  requiresAccountPassword?: boolean;
  accountPasswordLabel?: string;
  requiresServicePassword?: boolean;
  servicePasswordLabel?: string;
  requiresSocialLogin?: boolean;
  socialLoginMethods?: SocialLoginMethod[];
  requiresSeparateZone?: boolean;
  zoneLabel?: string;
}

export const DEFAULT_CHECKOUT: ProductCheckoutConfig = {
  identifier: 'email',
  requiresAccountPassword: false,
  requiresServicePassword: false,
  requiresSocialLogin: false,
  requiresSeparateZone: false,
  socialLoginMethods: ['google', 'facebook'],
};

export const CHECKOUT_IDENTIFIER_OPTIONS: Array<{
  value: CheckoutIdentifierType;
  label: string;
  description: string;
}> = [
  {
    value: 'gameId',
    label: 'Game / Player ID',
    description: 'PUBG, Free Fire, Garena ID, etc.',
  },
  {
    value: 'gameIdWithZone',
    label: 'Game ID + Zone (single field)',
    description: 'ID and zone in one input (e.g. 12345678, NA)',
  },
  {
    value: 'email',
    label: 'Email address',
    description: 'Netflix, ChatGPT, subscription accounts',
  },
  {
    value: 'username',
    label: 'Username',
    description: 'Social followers (Instagram, TikTok, Facebook)',
  },
  {
    value: 'postLink',
    label: 'Post link',
    description: 'Likes/views — link to the post',
  },
  {
    value: 'channelUrl',
    label: 'Channel URL',
    description: 'YouTube channel or similar',
  },
  {
    value: 'none',
    label: 'None (social login only)',
    description: 'Use when social login fields replace the main identifier',
  },
];

export function getIdentifierFieldMeta(
  checkout: ProductCheckoutConfig,
): {
  label: string;
  placeholder: string;
  inputType: 'text' | 'email';
} {
  if (checkout.identifierLabel && checkout.identifierPlaceholder) {
    return {
      label: checkout.identifierLabel,
      placeholder: checkout.identifierPlaceholder,
      inputType: checkout.identifier === 'email' ? 'email' : 'text',
    };
  }

  switch (checkout.identifier) {
    case 'gameId':
      return {
        label: 'Player / Game ID',
        placeholder: 'Enter your game ID',
        inputType: 'text',
      };
    case 'gameIdWithZone':
      return {
        label: 'ID and Zone',
        placeholder: 'Enter your ID and Zone (e.g., 12345678, NA)',
        inputType: 'text',
      };
    case 'email':
      return {
        label: 'Email Address',
        placeholder: 'Enter your email address',
        inputType: 'email',
      };
    case 'username':
      return {
        label: 'Username',
        placeholder: 'Enter your username',
        inputType: 'text',
      };
    case 'postLink':
      return {
        label: 'Post Link',
        placeholder: 'Paste your post link',
        inputType: 'text',
      };
    case 'channelUrl':
      return {
        label: 'Channel URL',
        placeholder: 'Enter your channel URL',
        inputType: 'text',
      };
    default:
      return {
        label: 'Account ID',
        placeholder: 'Enter your account details',
        inputType: 'text',
      };
  }
}

/** Infer checkout rules for products created before checkout config existed. */
export function inferCheckoutFromProduct(product: {
  platform: string;
  type: string;
  category?: string;
  gameId?: string;
  emailId?: string;
  zone?: string;
}): ProductCheckoutConfig {
  const { platform, type } = product;

  if (product.gameId === 'yes' && product.zone === 'yes') {
    return { ...DEFAULT_CHECKOUT, identifier: 'gameIdWithZone' };
  }
  if (product.gameId === 'yes') {
    return { ...DEFAULT_CHECKOUT, identifier: 'gameId' };
  }
  if (product.emailId === 'yes') {
    return { ...DEFAULT_CHECKOUT, identifier: 'email' };
  }

  if (platform === 'tiktok' && type === 'coins') {
    return {
      ...DEFAULT_CHECKOUT,
      identifier: 'none',
      requiresSocialLogin: true,
      socialLoginMethods: ['google', 'facebook'],
    };
  }

  if (
    (platform === 'instagram' ||
      platform === 'facebook' ||
      platform === 'tiktok') &&
    type === 'followers'
  ) {
    return {
      ...DEFAULT_CHECKOUT,
      identifier: 'username',
      identifierLabel:
        platform === 'instagram'
          ? 'Instagram Username'
          : platform === 'facebook'
            ? 'Facebook Username'
            : 'TikTok Username',
      identifierPlaceholder: `Enter your ${platform} username`,
    };
  }

  if (
    (platform === 'instagram' ||
      platform === 'facebook' ||
      platform === 'tiktok') &&
    (type === 'likes' || type === 'views')
  ) {
    return {
      ...DEFAULT_CHECKOUT,
      identifier: 'postLink',
      identifierLabel:
        platform === 'instagram'
          ? 'Instagram Post Link'
          : platform === 'facebook'
            ? 'Facebook Post Link'
            : 'TikTok Post Link',
      identifierPlaceholder: 'Paste your post link',
    };
  }

  if (platform === 'youtube' && type === 'subscribers') {
    return {
      ...DEFAULT_CHECKOUT,
      identifier: 'channelUrl',
      identifierLabel: 'YouTube Channel URL',
      identifierPlaceholder: 'Enter your YouTube channel URL',
    };
  }

  if (platform === 'garena' || platform === 'garena-shell') {
    return {
      ...DEFAULT_CHECKOUT,
      identifier: 'gameId',
      identifierLabel: 'Garena Account ID',
      identifierPlaceholder: 'Enter your Garena Account ID',
      requiresAccountPassword: true,
      accountPasswordLabel: 'Garena Password',
    };
  }

  if (platform === 'konami') {
    return {
      ...DEFAULT_CHECKOUT,
      identifier: 'email',
      requiresServicePassword: true,
      servicePasswordLabel: 'Konami Password',
    };
  }

  if (platform === 'pubg' || type === 'uc' || type === 'diamonds') {
    return { ...DEFAULT_CHECKOUT, identifier: 'gameId' };
  }

  if (
    type === 'account' ||
    platform.includes('netflix') ||
    platform.includes('chatgpt') ||
    platform === 'youtube-premium' ||
    platform === 'prime-video' ||
    platform === 'canva' ||
    platform === 'paypal' ||
    platform === 'skrill'
  ) {
    return { ...DEFAULT_CHECKOUT, identifier: 'email' };
  }

  if (product.category === 'gaming' || type === 'uc' || type === 'shell') {
    return { ...DEFAULT_CHECKOUT, identifier: 'gameId' };
  }

  return { ...DEFAULT_CHECKOUT, identifier: 'email' };
}

/** Convert Mongoose subdocuments or polluted token data into a plain checkout object. */
export function toPlainCheckout(
  checkout: unknown,
): Partial<ProductCheckoutConfig> | null {
  if (!checkout || typeof checkout !== 'object') {
    return null;
  }

  const record = checkout as Record<string, unknown>;

  // Mongoose subdocument spread into JSON keeps real values in _doc
  if (record._doc && typeof record._doc === 'object') {
    return record._doc as Partial<ProductCheckoutConfig>;
  }

  if (
    typeof (checkout as { toObject?: () => object }).toObject === 'function'
  ) {
    return (checkout as { toObject: () => object }).toObject() as Partial<
      ProductCheckoutConfig
    >;
  }

  if (typeof record.identifier === 'string') {
    return record as Partial<ProductCheckoutConfig>;
  }

  return null;
}

export type CheckoutConfigSource = {
  platform: string;
  type: string;
  category?: string;
  gameId?: string;
  emailId?: string;
  zone?: string;
  checkout?: ProductCheckoutConfig | unknown;
};

export function resolveCheckoutConfig(
  product: CheckoutConfigSource,
): ProductCheckoutConfig {
  const plainCheckout = toPlainCheckout(product.checkout);

  if (plainCheckout?.identifier) {
    return normalizeCheckoutInput(plainCheckout);
  }

  return inferCheckoutFromProduct({
    platform: product.platform,
    type: product.type,
    category: product.category,
    gameId: product.gameId,
    emailId: product.emailId,
    zone: product.zone,
  });
}

export function normalizeCheckoutInput(
  input?: Partial<ProductCheckoutConfig> | null,
): ProductCheckoutConfig {
  const plain = toPlainCheckout(input) ?? input;

  if (!plain?.identifier) {
    return { ...DEFAULT_CHECKOUT };
  }

  return {
    ...DEFAULT_CHECKOUT,
    ...plain,
    socialLoginMethods:
      plain.socialLoginMethods ?? DEFAULT_CHECKOUT.socialLoginMethods,
  };
}

import { MessageContext } from 'vk-io';

export type Feature = 'mee' | 'gpt';

export type FeatureFlags = Record<Feature, boolean>;

export type ResponseFunction = (messageContext: MessageContext) => void;

export type Command = 'help' | 'roll' | 'ask';

export type CommandWithPrefix = `!${Command}`;

import { AISDKError } from '@ai-sdk/provider';
import { LanguageModelResponseMetadata } from '../core/types/language-model-response-metadata';
import { LanguageModelUsage } from '../core/types/usage';

const name = 'AI_NoObjectGeneratedError';
const marker = `vercel.ai.error.${name}`;
const symbol = Symbol.for(marker);

/**
Thrown when no object could be generated. This can have several causes:

- The model failed to generate a response.
- The model generated a response that could not be parsed.
- The model generated a response that could not be validated against the schema.

The error contains the following properties:

- `text`: The text that was generated by the model. This can be the raw text or the tool call text, depending on the model.
 */
export class NoObjectGeneratedError extends AISDKError {
  private readonly [symbol] = true; // used in isInstance

  /**
  The text that was generated by the model. This can be the raw text or the tool call text, depending on the model.
   */
  readonly text: string | undefined;

  /**
  The response metadata.
   */
  readonly response: LanguageModelResponseMetadata | undefined;

  /**
  The usage of the model.
   */
  readonly usage: LanguageModelUsage | undefined;

  constructor({
    message = 'No object generated.',
    cause,
    text,
    response,
    usage,
  }: {
    message?: string;
    cause?: Error;
    text?: string;
    response: LanguageModelResponseMetadata;
    usage: LanguageModelUsage;
  }) {
    super({ name, message, cause });

    this.text = text;
    this.response = response;
    this.usage = usage;
  }

  static isInstance(error: unknown): error is NoObjectGeneratedError {
    return AISDKError.hasMarker(error, marker);
  }
}

export function verifyNoObjectGeneratedError(
  error: unknown,
  expected: {
    message: string;
    response: LanguageModelResponseMetadata;
    usage: LanguageModelUsage;
  },
) {
  expect(NoObjectGeneratedError.isInstance(error)).toBeTruthy();
  const noObjectGeneratedError = error as NoObjectGeneratedError;
  expect(noObjectGeneratedError.message).toStrictEqual(expected.message);
  expect(noObjectGeneratedError.response).toStrictEqual(expected.response);
  expect(noObjectGeneratedError.usage).toStrictEqual(expected.usage);
}
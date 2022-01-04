import { NullValue } from '../../grpc/google/protobuf/struct';
import { PropertyBatchOperation } from '../../grpc/indykite/identity/v1beta1/attributes';

type UnknownObject = { [k: string]: unknown };

export class Properties {
  static fromPropertiesList(properties: string[] = []): { definition: { property: string } }[] {
    return properties.map((property) => {
      return {
        definition: {
          property,
        },
      };
    });
  }

  static fromDuration(
    seconds: number,
    nanos?: number,
  ): { durationValue: { seconds: number; nanos: number | undefined } } {
    return {
      durationValue: { seconds, nanos },
    };
  }

  static fromGeoLocation(
    latitude: number,
    longitude: number,
  ): { geoPointValue: { latitude: number; longitude: number } } {
    return {
      geoPointValue: { latitude, longitude },
    };
  }

  static fromBytes(bytes: Buffer): { bytesValue: Buffer } {
    return { bytesValue: bytes };
  }

  static fromIdentitier(
    id: string | Buffer,
  ): { identifierValue: { idString: string } } | { identifierValue: { idBytes: Buffer } } {
    if (typeof id === 'string') {
      return { identifierValue: { idString: id } };
    }
    return { identifierValue: { idBytes: id } };
  }

  /*
   * Based on the type of the passed value build an appropriate JSON object
   */
  static objectToValue(value: unknown): unknown {
    if (typeof value === 'undefined') {
      return { nullValue: NullValue.NULL_VALUE };
    }
    if (
      typeof value === 'object' &&
      value &&
      ('geoPointValue' in value || 'durationValue' in value || 'bytesValue' in value)
    ) {
      return value;
    }

    switch (typeof value) {
      case 'boolean':
        return { boolValue: value };
      case 'number':
        return { doubleValue: value };
      case 'string':
        return { stringValue: value };
      case 'object': {
        if (value instanceof Date) return { valueTime: value };
        if (Array.isArray(value)) {
          return {
            arrayValue: {
              value: value.map((v) => this.objectToValue(v)),
            },
          };
        }
        const m: UnknownObject = {};
        if (value) {
          Object.entries<unknown>(value as UnknownObject).forEach(([k, v]) => {
            m[k] = this.objectToValue(v);
          });
        }
        return { fields: { ...m } };
      }
    }
    //TODO: add anyValue
    // anyValue: Any ///expects Buffer
  }
}

// type AddProperty = { add: { definition: { property: string }; objectValue: unknown } };
// type ReplaceProperty = { replace: { id: string; objectValue: unknown } };
// type DeleteProperty = { delete: { id: string } };
// type PropertyOperation = AddProperty | ReplaceProperty | DeleteProperty;

export class PatchPropertiesBuilder {
  operations: PropertyBatchOperation[] = [];
  add: PropertyBatchOperation[] = [];
  replace: PropertyBatchOperation[] = [];
  delete: PropertyBatchOperation[] = [];

  static newBuilder(): PatchPropertiesBuilder {
    return new PatchPropertiesBuilder();
  }

  addProperty(name: string, value: unknown): PatchPropertiesBuilder {
    this.operations.push(
      PropertyBatchOperation.fromJSON({
        add: {
          definition: {
            property: name,
          },
          objectValue: Properties.objectToValue(value),
        },
      }),
    );
    return this;
  }

  replaceProperty(id: string, value: unknown): PatchPropertiesBuilder {
    this.operations.push(
      PropertyBatchOperation.fromJSON({
        replace: {
          id,
          objectValue: Properties.objectToValue(value),
        },
      }),
    );
    return this;
  }

  deleteProperty(id: string): PatchPropertiesBuilder {
    this.operations.push(
      PropertyBatchOperation.fromJSON({
        remove: {
          id: id,
        },
      }),
    );
    return this;
  }

  build(): PropertyBatchOperation[] {
    return this.operations;
  }
}

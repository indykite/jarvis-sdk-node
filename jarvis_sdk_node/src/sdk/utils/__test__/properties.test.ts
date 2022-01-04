import { NullValue } from '../../../grpc/google/protobuf/struct';
import { PatchPropertiesBuilder, Properties } from '../properties';

describe('properties builder', () => {
  let builder: PatchPropertiesBuilder;
  beforeEach(() => {
    builder = PatchPropertiesBuilder.newBuilder();
  });

  it('creates an empty property list', () => {
    expect(builder.build()).toEqual([]);
  });

  describe('when a property is added', () => {
    beforeEach(() => {
      builder.addProperty('propName', 42);
    });

    it('adds the property', () => {
      expect(builder.build()).toEqual([
        {
          operation: {
            $case: 'add',
            add: {
              definition: {
                context: '',
                property: 'propName',
                type: '',
              },
              id: '',
              value: {
                $case: 'objectValue',
                objectValue: {
                  value: {
                    $case: 'doubleValue',
                    doubleValue: 42,
                  },
                },
              },
            },
          },
        },
      ]);
    });
  });

  describe('when a property is removed', () => {
    beforeEach(() => {
      builder.deleteProperty('myProp');
    });

    it('removes the property', () => {
      expect(builder.build()).toEqual([
        {
          operation: {
            $case: 'remove',
            remove: {
              id: 'myProp',
            },
          },
        },
      ]);
    });
  });

  describe('when a property is replaced', () => {
    beforeEach(() => {
      builder.replaceProperty('awesomeProp', 'abc');
    });

    it('removes the property', () => {
      expect(builder.build()).toEqual([
        {
          operation: {
            $case: 'replace',
            replace: {
              id: 'awesomeProp',
              value: {
                $case: 'objectValue',
                objectValue: {
                  value: {
                    $case: 'stringValue',
                    stringValue: 'abc',
                  },
                },
              },
            },
          },
        },
      ]);
    });
  });
});

describe('properties', () => {
  let properties: unknown;
  describe('when created from empty properties list', () => {
    beforeEach(() => {
      properties = Properties.fromPropertiesList();
    });

    it('returns an empty list of properties', () => {
      expect(properties).toEqual([]);
    });
  });

  describe('when created from non-empty properties list', () => {
    beforeEach(() => {
      properties = Properties.fromPropertiesList(['prop1', 'prop2']);
    });

    it('returns a list of properties', () => {
      expect(properties).toEqual([
        {
          definition: {
            property: 'prop1',
          },
        },
        {
          definition: {
            property: 'prop2',
          },
        },
      ]);
    });
  });

  describe('when created from seconds', () => {
    beforeEach(() => {
      properties = Properties.fromDuration(15);
    });

    it('returns a property with seconds', () => {
      expect(properties).toEqual({
        durationValue: {
          seconds: 15,
          nanos: undefined,
        },
      });
    });
  });

  describe('when created from seconds and nanos', () => {
    beforeEach(() => {
      properties = Properties.fromDuration(15, 61);
    });

    it('returns a property with seconds and nanos', () => {
      expect(properties).toEqual({
        durationValue: {
          seconds: 15,
          nanos: 61,
        },
      });
    });
  });

  describe('when created from a geo location', () => {
    beforeEach(() => {
      properties = Properties.fromGeoLocation(490669456, 189234339);
    });

    it('returns a property with the geo location', () => {
      expect(properties).toEqual({
        geoPointValue: {
          latitude: 490669456,
          longitude: 189234339,
        },
      });
    });
  });

  describe('when created from bytes', () => {
    const bytesBuffer = Buffer.from([0x62, 0x63]);
    beforeEach(() => {
      properties = Properties.fromBytes(bytesBuffer);
    });

    it('returns a property with bytes', () => {
      expect(properties).toEqual({
        bytesValue: bytesBuffer,
      });
    });
  });

  describe('when created from a string identifier', () => {
    beforeEach(() => {
      properties = Properties.fromIdentitier('xyz');
    });

    it('returns a property with the string identifier', () => {
      expect(properties).toEqual({
        identifierValue: {
          idString: 'xyz',
        },
      });
    });
  });

  describe('when created from a binary identifier', () => {
    const buffer = Buffer.from([0x33, 0x34, 0x35]);
    beforeEach(() => {
      properties = Properties.fromIdentitier(buffer);
    });

    it('returns a property with the binary identifier', () => {
      expect(properties).toEqual({
        identifierValue: {
          idBytes: buffer,
        },
      });
    });
  });

  describe('when an object is converted to a value', () => {
    describe('when the object is undefined', () => {
      beforeEach(() => {
        properties = Properties.objectToValue(undefined);
      });

      it('returns a correct value', () => {
        expect(properties).toEqual({
          nullValue: NullValue.NULL_VALUE,
        });
      });
    });

    describe('when the object is a duration value', () => {
      const durationValue = Properties.fromDuration(11);
      beforeEach(() => {
        properties = Properties.objectToValue(durationValue);
      });

      it('returns a correct value', () => {
        expect(properties).toBe(durationValue);
      });
    });

    describe('when the object is a boolean value', () => {
      beforeEach(() => {
        properties = Properties.objectToValue(false);
      });

      it('returns a correct value', () => {
        expect(properties).toEqual({
          boolValue: false,
        });
      });
    });

    describe('when the object is a number value', () => {
      beforeEach(() => {
        properties = Properties.objectToValue(70);
      });

      it('returns a correct value', () => {
        expect(properties).toEqual({
          doubleValue: 70,
        });
      });
    });

    describe('when the object is a string value', () => {
      beforeEach(() => {
        properties = Properties.objectToValue('aaa');
      });

      it('returns a correct value', () => {
        expect(properties).toEqual({
          stringValue: 'aaa',
        });
      });
    });

    describe('when the object is a date value', () => {
      const date = new Date(2022, 0, 4);
      beforeEach(() => {
        properties = Properties.objectToValue(date);
      });

      it('returns a correct value', () => {
        expect(properties).toEqual({
          valueTime: date,
        });
      });
    });

    describe('when the object is an array value', () => {
      beforeEach(() => {
        properties = Properties.objectToValue([44, 'xy']);
      });

      it('returns a correct value', () => {
        expect(properties).toEqual({
          arrayValue: {
            value: [
              {
                doubleValue: 44,
              },
              {
                stringValue: 'xy',
              },
            ],
          },
        });
      });
    });

    describe('when the object is an unknown object', () => {
      beforeEach(() => {
        properties = Properties.objectToValue({ hello: 'world' });
      });

      it('returns a correct value', () => {
        expect(properties).toEqual({
          fields: {
            hello: {
              stringValue: 'world',
            },
          },
        });
      });
    });
  });
});

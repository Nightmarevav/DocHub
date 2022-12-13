import DefaultSchema from './default/schema.json';
import Query from '../src/manifest/query';
import YAML from 'yaml';

test('Forms object to schema', () => {
	const query = YAML.parse(`
    test-aspect:
      title: test-aspect
      location: test-aspect
      default-context: default-context
  `);

	DefaultSchema.aspects = query;
	const evaluated = Query.expression(Query.defaultContextForAspect('test-aspect')).evaluate(DefaultSchema);

	expect(evaluated).toEqual('default-context');
});

test('Forms object to schema', () => {
	const query = YAML.parse(`
    test-aspect:
      title: test-aspect
      location: test-aspect
  `);

	DefaultSchema.aspects = query;
	const evaluated = Query.expression(Query.defaultContextForAspect('test-aspect')).evaluate(DefaultSchema);

	expect(evaluated).toEqual(undefined);
});

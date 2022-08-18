import DefaultSchema from './default/schema.json';
import Query from '../src/manifest/query';
import YAML from 'yaml';

test('Forms object to schema', () => {
	const query = YAML.parse(`
    entity: 
      component
    fields:
      test1:
        title: test1
        required: true
      test2:
        title: test2
        required: true
  `);

	DefaultSchema.forms = query;
	const evaluated = Query.expression(Query.summaryForComponent('test')).evaluate(DefaultSchema);

	expect(evaluated.map(e => e.field)).toEqual(['id', 'title', 'test1', 'test2']);
});

test('Forms entities array to schema', () => {
	const query = YAML.parse(`
    - entity: 
        - component
        - test
      fields:
        test1:
          title: test1  
          required: true
        test2:
          title: test2
          required: true
    - entity: 
        component
      fields:
        test1:
          title: test3
          required: true
  `);

	DefaultSchema.forms = query;
	const evaluated = Query.expression(Query.summaryForComponent('test')).evaluate(DefaultSchema);

	expect(evaluated.map(e => e.field)).toEqual(['id', 'title', 'test1', 'test2']);
	expect(evaluated.map(e => e.title)).toEqual(['Идентификатор', 'Название', 'test3', 'test2']);
});

test('Forms entities merge', () => {
	const query = YAML.parse(`
  - entity: 
      - component
      - test
    fields:
      test1:
        title: test1
        required: true
      test2:
        title: test2
        required: true
  - entity: 
      component
    fields:
      test3:
        title: test3
        required: true
      test4:
        title: test4
        required: true
  `);

	DefaultSchema.forms = query;
	const evaluated = Query.expression(Query.summaryForComponent('test')).evaluate(DefaultSchema);

	expect(evaluated.map(e => e.field)).toEqual(['id', 'title', 'test1', 'test2', 'test3', 'test4']);
	expect(evaluated.map(e => e.title)).toEqual(['Идентификатор', 'Название', 'test1', 'test2', 'test3', 'test4']);
});

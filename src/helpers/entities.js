// Обрабатывает кастомные сущности
import query from '@/manifest/query';
import crc16 from '@/helpers/crc16';
import env from '@/helpers/env';

let appliedSchemaCRC = null;

// Регистрирует кастомные сущности
export default function(manifest) {
	if (env.isPlugin()) {
		const schema = JSON.stringify(query.expression(query.entitiesJSONChema()).evaluate(manifest || {}));
		const crc = crc16(schema);
		if (crc != appliedSchemaCRC) {
			window.$PAPI.applyEntitiesSchema(schema);
			appliedSchemaCRC = crc;
		}
	}
}

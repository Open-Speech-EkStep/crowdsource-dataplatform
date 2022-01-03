/* Replace with your SQL commands */

delete from validations where validation_id not in (select max(validation_id) from validations group by contribution_id, validated_by); 

ALTER TABLE validations
DROP CONSTRAINT IF EXISTS UC_validated_contribution;

ALTER TABLE validations
ADD CONSTRAINT UC_validated_contribution UNIQUE (validated_by,contribution_id);
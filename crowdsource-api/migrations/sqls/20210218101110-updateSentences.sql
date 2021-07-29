ALTER TABLE "sentences" DROP COLUMN "fileName";

ALTER TABLE "sentences" DROP COLUMN "userId";

ALTER TABLE "sentences" DROP COLUMN "userName";

ALTER TABLE "sentences" DROP COLUMN "ageGroup";

ALTER TABLE "sentences" DROP COLUMN gender;

ALTER TABLE "sentences" DROP COLUMN "motherTongue";

ALTER TABLE "sentences" DROP COLUMN assign;

ALTER TABLE "sentences" DROP COLUMN "assignDate";

ALTER TABLE "sentences"
    ADD COLUMN state text;


update "sentences" s set "state" = 'contributed'
from "contributions" con
where s."sentenceId" = con."sentenceId" and con.action = 'completed';
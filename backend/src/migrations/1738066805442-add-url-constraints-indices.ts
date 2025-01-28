import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUrlConstraintsIndices1738066805442
  implements MigrationInterface
{
  name = 'AddUrlConstraintsIndices1738066805442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "url" ALTER COLUMN "shortCode" TYPE character varying(8)`,
    );
    await queryRunner.query(
      `ALTER TABLE "url" ADD CONSTRAINT "UQ_shortCode" UNIQUE ("shortCode")`,
    );

    await queryRunner.query(
      `ALTER TABLE "url" ALTER COLUMN "originalUrl" TYPE character varying(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "url" ADD CONSTRAINT "UQ_originalUrl" UNIQUE ("originalUrl")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_df4aaf7b2c247152f3e92fe7c7" ON "url" ("shortCode")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "url" DROP CONSTRAINT "UQ_shortCode"`);
    await queryRunner.query(
      `ALTER TABLE "url" DROP CONSTRAINT "UQ_originalUrl"`,
    );

    await queryRunner.query(
      `DROP INDEX "public"."IDX_df4aaf7b2c247152f3e92fe7c7"`,
    );
  }
}

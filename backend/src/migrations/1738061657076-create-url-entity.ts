import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUrlEntity1738061657076 implements MigrationInterface {
  name = 'CreateUrlEntity1738061657076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "url" ("id" SERIAL NOT NULL, "originalUrl" character varying NOT NULL, "shortCode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c2d12ff0f1539bfc1b2db9dda61" UNIQUE ("originalUrl"), CONSTRAINT "UQ_df4aaf7b2c247152f3e92fe7c78" UNIQUE ("shortCode"), CONSTRAINT "PK_7421088122ee64b55556dfc3a91" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "url"`);
  }
}

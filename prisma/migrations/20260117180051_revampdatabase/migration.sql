/*
  Warnings:

  - You are about to drop the column `created_by` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `is_done` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `UserTask` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `priority` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('todo', 'in_progress', 'done');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');

-- DropForeignKey
ALTER TABLE "UserTask" DROP CONSTRAINT "UserTask_task_id_fkey";

-- DropForeignKey
ALTER TABLE "UserTask" DROP CONSTRAINT "UserTask_user_id_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "created_by",
DROP COLUMN "is_done",
ADD COLUMN     "status" "Status" NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "priority",
ADD COLUMN     "priority" "Priority" NOT NULL,
ALTER COLUMN "deadline" DROP NOT NULL;

-- DropTable
DROP TABLE "UserTask";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

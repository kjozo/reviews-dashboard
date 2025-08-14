-- CreateTable
CREATE TABLE "ApprovedReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reviewId" INTEGER NOT NULL,
    "listingMapId" INTEGER NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'hostaway',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ApprovedReview_reviewId_listingMapId_source_key" ON "ApprovedReview"("reviewId", "listingMapId", "source");

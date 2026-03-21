import ReviewArchiveClient from "../components/review-archive-client";
import { getArchiveData } from "@/lib/db-ui";

export const metadata = {
  description: "Searchable archive and pattern reports from live review data.",
};

export default async function ReviewArchivePage() {
  const { reviewArchive, patternReports } = await getArchiveData();

  return (
    <ReviewArchiveClient
      reviewArchive={reviewArchive}
      patternReports={patternReports}
    />
  );
}

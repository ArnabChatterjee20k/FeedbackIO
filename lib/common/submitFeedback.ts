// api/feedback.ts
type FeedbackParams = {
  spaceId: string;
  feedback: string;
  stars?: number;
  name?: string;
  userEmail?: string;
  userID?: string;
};

export async function submitFeedback({
  spaceId,
  feedback,
  stars,
  name,
  userEmail,
  userID
}: FeedbackParams) {
  try {
    const response = await fetch(`/api/${spaceId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback,
        stars,
        name,
        userEmail,
        userID
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit feedback');
    }

    return data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}
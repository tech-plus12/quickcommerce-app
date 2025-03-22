const BASE_URL = 'YOUR_API_BASE_URL';

export const getOnboardingSlides = async () => {
  try {
    const response = await fetch(`${BASE_URL}/onboarding-slides`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw error;
  }
}; 
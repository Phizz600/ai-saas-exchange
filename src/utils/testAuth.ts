import { NewAuthService } from '@/services/newAuthService';

export const createTestUser = async () => {
  try {
    console.log('Creating test user...');
    
    const testUserData = {
      email: `test.user.${Date.now()}@example.com`,
      password: 'testPassword123',
      firstName: 'Test',
      lastName: 'User',
      userType: 'ai_investor' as const
    };

    console.log('Test user data:', testUserData);

    const result = await NewAuthService.signUp(testUserData);
    
    console.log('Test user creation result:', result);
    
    if (result.user) {
      console.log('✅ Test user created successfully!');
      console.log('User ID:', result.user.id);
      console.log('Email verified:', !result.needsEmailVerification);
      return { success: true, user: result.user, email: testUserData.email };
    } else {
      console.log('❌ Failed to create test user');
      return { success: false, error: 'No user returned' };
    }
    
  } catch (error: any) {
    console.error('❌ Test user creation failed:', error);
    return { success: false, error: error.message };
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).createTestUser = createTestUser;
}
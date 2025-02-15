
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileProps {
  userId: string;
  onClose: () => void;
}

export function UserProfile({ userId, onClose }: UserProfileProps) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      setProfile(data);
    };

    fetchProfile();
  }, [userId]);

  if (!profile) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="mt-8">
        <div className="flex items-center mb-6">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl text-gray-600">
                {profile.full_name?.[0] || profile.username?.[0] || '?'}
              </span>
            </div>
          )}
          <div className="ml-4">
            <h3 className="font-semibold text-lg">{profile.full_name}</h3>
            <p className="text-gray-500">{profile.username}</p>
          </div>
        </div>

        {profile.bio && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Bio</h4>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-500">User Type</h4>
            <p className="text-gray-700 capitalize">{profile.user_type}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Member Since</h4>
            <p className="text-gray-700">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

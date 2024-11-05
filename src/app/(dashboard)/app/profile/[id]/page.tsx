"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SportsSocialFeed from "@/components/app/social/SportsSocialFeed";
import { api } from "~/trpc/react";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { User } from "@prisma/client";
interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const { data: currentUser, isLoading: isCurrentUserLoading }: { data: User | undefined, isLoading: boolean } = api.user.getCurrentUser.useQuery();
  const { data: profileUser, isLoading: isProfileUserLoading }: { data: User | undefined, isLoading: boolean }   = api.user.getById.useQuery({ id: params.id });
  const { data: followersCount } = api.user.getFollowersCount.useQuery({ userId: params.id });
  const { data: followingCount } = api.user.getFollowingCount.useQuery({ userId: params.id });
  const { data: isFollowingData } = api.user.isFollowing.useQuery(
    { followerId: currentUser?.id ?? '', followingId: params.id },
    { enabled: !!currentUser }
  );

  const followMutation = api.user.followUser.useMutation();
  const unfollowMutation = api.user.unfollowUser.useMutation();
  const updateBioMutation = api.user.updateBio.useMutation();
  
  useEffect(() => {
    if (isFollowingData !== undefined) {
      setIsFollowing(isFollowingData);
    }
  }, [isFollowingData]);

  useEffect(() => {
    if (profileUser?.bio) {
      setBio(profileUser.bio);
    }
  }, [profileUser]);

  if (isCurrentUserLoading ?? isProfileUserLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser ?? !profileUser) {
    router.push("/404");
    return null;
  }
  let isOwnProfile = false
  isOwnProfile = currentUser?.id === profileUser.id;

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowMutation.mutateAsync({ followingId: profileUser.id });
    } else {
      await followMutation.mutateAsync({ followingId: profileUser.id });
    }
    setIsFollowing(!isFollowing);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 500) {
      setBio(e.target.value);
    }
  };

  const handleBioSave = async () => {
    await updateBioMutation.mutateAsync({ bio });
    setIsEditingBio(false);
  };

  const handleBioKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey ?? e.ctrlKey)) {
      void handleBioSave();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileUser.image ?? undefined} alt={profileUser.firstName ?? ''} />
                <AvatarFallback>{profileUser.firstName?.charAt(0) ?? ''}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-2xl">{profileUser.firstName} {profileUser.lastName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                {isOwnProfile && (
                  <Button
                    onClick={() => setIsEditingBio(!isEditingBio)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 p-1"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {isEditingBio ? (
                  <>
                    <Textarea
                      value={bio}
                      onChange={handleBioChange}
                      onKeyDown={handleBioKeyDown}
                      placeholder="Write your bio here..."
                      className="mb-2 pr-8 text-center"
                      maxLength={500}
                    />
                    <p className="text-sm text-gray-500 mt-1 text-center">
                      {500 - bio.length} characters remaining
                      <br />
                      Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to save
                    </p>
                  </>
                ) : (
                  <p className="text-sm pr-8 text-center whitespace-pre-wrap">{bio ?? 'No bio available.'}</p>
                )}
              </div>
              <div className="flex justify-around mb-4">
                <div className="text-center">
                  <p className="font-bold">{followersCount}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{followingCount}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>
              {!isOwnProfile && (
                <Button 
                  className="w-full" 
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-2/3">
          <SportsSocialFeed currentUser={currentUser} profileUserId={profileUser.id} />
        </div>
      </div>
    </div>
  );
}

import { RatingLevel, Roles } from 'App/Enum'
import { DateTime } from 'luxon'

type ObjectLiteral = {
  [key: string]: any
}

type User = {
  first_name: string
  last_name: string
  phone_number: string
  email: string
  role: Roles
  password: string
  banned: boolean
  banned_at: string
  created_at: DateTime
  updated_at: DateTime
}

type Login = Pick<User, 'email' | 'password'>
type Register = Omit<User, 'banned' | 'banned_at' | 'created_at' | 'updated_at' | 'role'>
type UpdateUser = Omit<User, 'password' | 'banned' | 'banned_at' | 'created_at' | 'updated_at'>

type CreateWorker = Pick<User, 'first_name' | 'last_name' | 'email' | 'role'>

type ChangePassword = {
  old_password: string;
  password: string;
}

type UpdatePricing = {
  price: number;
}

type ResetPassword = ChangePassword;

type ForgotPassword = {
  email: string;
}

type ResendVerification = ForgotPassword;

type Token = {
  token: string;
  email: string;
}

type UploadSong = {
  title: string;
  payment_reference: string;
}

type CreateSongAnalytics = {
  listening_duration: string;
  listened_at: DateTime;
};

type RateSongBody = {
  song_id: string;
  rating: RatingLevel;
  comment: string;
}

type ManualAllocation = {
  songId: string;
  workerId: string;
};

type AdminFeedbackBody = Omit<RateSongBody, "rating">;

type UpdateSongRating = Omit<RateSongBody, 'song_id'>;

export { Login, Register, ObjectLiteral, Token, UpdateUser, CreateSongAnalytics, ChangePassword, ForgotPassword, ResendVerification, ResetPassword, UpdatePricing, UploadSong, CreateWorker, RateSongBody, UpdateSongRating, AdminFeedbackBody, ManualAllocation }

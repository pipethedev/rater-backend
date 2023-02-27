const RegisterValidation = {
  first_name: 'required|string',
  last_name: 'required|string',
  phone_number: 'required',
  email: 'required|email',
  password: 'required|max:15',
}
const UpdateUserValidation = {
  first_name: 'required',
  last_name: 'required',
  phone_number: 'present',
  email: 'required|email',
}

const LoginValidation = {
  email: 'required|email',
  password: 'required',
}

const UpdatePasswordValidation = {
  old_password: 'required',
  password: 'required|confirmed'
}

const ResetPasswordValidation = {
  password: 'required|confirmed'
}

const CreateSongAnalytics = {
  listening_duration: 'string|required',
  listened_at: 'date|required'
};

const CreateWorker = UpdateUserValidation;

const RateSongValidation = {
  song_id: 'required|uuid|string',
  rating: 'required|in:Good,Bad,Fair',
  likeComment: 'required|string',
  disLikeComment: 'required|string',
  improvementComment: 'required|string'
}

export {
  RegisterValidation,
  LoginValidation,
  UpdateUserValidation,
  UpdatePasswordValidation,
  ResetPasswordValidation,
  CreateWorker,
  RateSongValidation,
  CreateSongAnalytics
}

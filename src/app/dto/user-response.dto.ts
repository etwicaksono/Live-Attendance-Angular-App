export class UserResponseDto {
  "id": number;
  "user_id": number;
  "name": string;
  "job_role": string;
  "created_at": Date;
  "updated_at": Date;
  "user": {
    "id": number,
    "username": string,
    "role": string,
    "is_active": boolean,
    "created_at": Date,
    "updated_at": Date,
  };
}

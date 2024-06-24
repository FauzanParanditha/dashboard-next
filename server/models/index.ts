import { ObjectId } from "mongodb";

export interface BaseModel {
  _id: ObjectId;
  _created: Date;
  _modified: Date;
}

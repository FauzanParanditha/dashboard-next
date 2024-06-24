import { Db, Filter, ObjectId, SortDirection } from "mongodb";
import { BaseModel } from ".";
import connectDB from "@/server/database";
import {
  ParsePaginateAndQueryProp,
  parsePaginateAndQuery,
} from "@/utils/paginate";
import { escapeRegExp } from "@/utils/escape";

export interface EmailLog extends BaseModel {
  email: string;
  messages: any;
  status: string;
  do_time: Date;
}

export const emailCollection = (db: Db) => db.collection<EmailLog>("email_log");

//find by id
export const findEmailById = async (id: ObjectId) => {
  const m = await connectDB();
  const result = await emailCollection(m).findOne({ _id: id });
  return result;
};

// find by email
export const findEmailByEmail = async (email: string) => {
  const m = await connectDB();
  const result = await emailCollection(m).findOne({ email: email });
  return result;
};

export const getAllEmail = async (
  countOnly = false,
  q: ParsePaginateAndQueryProp
) => {
  const filter: Filter<EmailLog> = {};
  const { query, limit, skip, sort_by, sort } = parsePaginateAndQuery(q);

  if (typeof query !== "undefined" && query !== "") {
    const searchTerm = query.trim(); // Trim to remove leading and trailing spaces

    if (searchTerm !== "") {
      filter["$or"] = [
        {
          $or: [{ email: { $regex: escapeRegExp(searchTerm), $options: "i" } }],
        },
      ];
    } else {
      delete filter["$or"]; // Remove $or if search term is empty
    }
  }

  //sort by default _modified : -1
  var sortField = "_id";
  if (sort_by) {
    sortField = escapeRegExp(sort_by);
  }

  var sortValue: SortDirection = -1;
  if (sort) {
    sortValue = sort;
  }

  const m = await connectDB();

  if (countOnly) {
    return emailCollection(m).countDocuments(filter);
  }

  const result = await emailCollection(m)
    .find(filter)
    .sort({ [sortField]: sortValue })
    .limit(Number(limit))
    .skip(skip)
    .toArray();

  const total = await emailCollection(m).countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return {
    data: result,
    pagination: {
      total,
      totalPages,
      currentPage: Math.ceil((skip + 1) / limit),
    },
  };
};

export const createEmailLog = async (email: EmailLog) => {
  const m = await connectDB();
  const result = await emailCollection(m).insertOne(email);
  return result;
};

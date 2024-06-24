import { Db, Filter, ObjectId, SortDirection } from "mongodb";
import { BaseModel } from ".";
import connectDB from "@/server/database";
import {
  ParsePaginateAndQueryProp,
  parsePaginateAndQuery,
} from "@/utils/paginate";
import { escapeRegExp } from "@/utils/escape";

export interface ActivityLog extends BaseModel {
  data: {
    [key: string]: any;
  };
  do_time: Date | null;
  do: string;
}

export const activityCollection = (db: Db) =>
  db.collection<ActivityLog>("activity_log");

//find by id
export const findActivityById = async (id: ObjectId) => {
  const m = await connectDB();
  const result = await activityCollection(m).findOne({ _id: id });
  return result;
};

// find by name
export const findActivityByName = async (fullName: string) => {
  const m = await connectDB();
  const result = await activityCollection(m).findOne({ fullName: fullName });
  return result;
};

export const getAllActivity = async (
  countOnly = false,
  q: ParsePaginateAndQueryProp
) => {
  const filter: Filter<ActivityLog> = {};
  const { query, limit, skip, sort_by, sort } = parsePaginateAndQuery(q);

  if (typeof query !== "undefined" && query !== "") {
    const searchTerm = query.trim(); // Trim to remove leading and trailing spaces

    if (searchTerm !== "") {
      filter["$or"] = [
        {
          $or: [
            {
              "data.fullName": {
                $regex: escapeRegExp(searchTerm),
                $options: "i",
              },
            },
          ],
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
    return activityCollection(m).countDocuments(filter);
  }

  const result = await activityCollection(m)
    .find(filter)
    .sort({ [sortField]: sortValue })
    .limit(Number(limit))
    .skip(skip)
    .toArray();

  const total = await activityCollection(m).countDocuments(filter);
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

export const createActivityLog = async (activity: ActivityLog) => {
  const m = await connectDB();
  const result = await activityCollection(m).insertOne(activity);
  return result;
};

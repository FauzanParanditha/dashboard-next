import { BaseModel } from ".";
import { Db, Filter, ObjectId, SortDirection } from "mongodb";
import connectDB from "@/server/database";
import {
  ParsePaginateAndQueryProp,
  parsePaginateAndQuery,
} from "@/utils/paginate";
import { escapeRegExp } from "@/utils/escape";

export interface Ip extends BaseModel {
  ip: string;
  name: string;
}

export const ipCollection = (db: Db) => db.collection<Ip>("ip");

// find by id
export const findIpById = async (id: ObjectId) => {
  const m = await connectDB();
  const result = await ipCollection(m).findOne({ _id: id });
  return result;
};

// find by ip
export const findIpByIp = async (ip: string) => {
  const m = await connectDB();
  if (ip.startsWith("::ffff:")) {
    const result = await ipCollection(m).findOne({ ip: ip.substring(7) });
    return result;
  }
  const result = await ipCollection(m).findOne({ ip: ip });
  return result;
};

// get all ip
export const getAllIp = async (
  countOnly = false,
  q: ParsePaginateAndQueryProp
) => {
  const filter: Filter<Ip> = {};
  const { query, limit, skip, sort_by, sort } = parsePaginateAndQuery(q);

  console.log(query);
  if (typeof query !== "undefined" && query !== "") {
    const searchTerm = query.trim(); // Trim to remove leading and trailing spaces

    if (searchTerm !== "") {
      filter["$or"] = [
        {
          $or: [
            {
              name: {
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

  // sort by default _modified : -1
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
    return ipCollection(m).countDocuments(filter);
  }

  const result = await ipCollection(m)
    .find(filter)
    .sort({ [sortField]: sortValue })
    .limit(Number(limit))
    .skip(skip)
    .toArray();

  const total = await ipCollection(m).countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return {
    data: result,
    pagination: {
      totalRecords: total,
      totalPages,
      current: Math.ceil((skip + 1) / limit),
      perPage: limit,
      recordsOnPage: result.length,
    },
  };
};

// create ip
export const createIp = async (data: Ip) => {
  const m = await connectDB();
  const result = await ipCollection(m).insertOne(data);
  return result;
};

// update ip
export const updateIp = async (data: Ip) => {
  const m = await connectDB();
  const result = await ipCollection(m).updateOne(
    {
      _id: data._id,
    },
    { $set: data }
  );
  return result;
};

// delete ip
export const deleteIpById = async (id: ObjectId) => {
  const m = await connectDB();
  const result = await ipCollection(m).deleteOne({ _id: id });
  return result;
};

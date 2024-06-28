import { DashboardLayout } from "@/components/layout";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import { Fragment } from "react";
import DetailAdm from "@/components/dashboard/admin/detailAdmin";

const DetailAdmin = () => {
  return (
    <>
      <DashboardLayout>
        <div className="container mx-auto my-8">
          <TabGroup>
            <div className="grid grid-cols-12 gap-6 my-4">
              <div className="col-span-full sm:col-span-12 bg-white shadow-lg rounded-sm border border-slate-200 p-4 dark:bg-slate-800">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <TabList>
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <li className="mr-2">
                            <a
                              href="#"
                              className={clsx(
                                "inline-flex p-4 rounded-t-lg border-b-2 group",
                                {
                                  ["text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500"]:
                                    selected,
                                  ["border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 "]:
                                    !selected,
                                }
                              )}
                            >
                              <svg
                                aria-hidden="true"
                                className={clsx("mr-2 w-5 h-5", {
                                  ["text-blue-600 dark:text-blue-500"]:
                                    selected,
                                })}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                              </svg>
                              Detail
                            </a>
                          </li>
                        )}
                      </Tab>
                    </ul>
                  </TabList>
                </div>
                <TabPanels>
                  <TabPanel>
                    <div className="mt-6 grid grid-cols-2">
                      <DetailAdm />
                    </div>
                  </TabPanel>
                </TabPanels>
              </div>
            </div>
          </TabGroup>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DetailAdmin;

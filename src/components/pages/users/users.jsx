import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { AddQuery, UpdateQeury, getQuery } from "../../shared/ipConfig";
import { Switch } from "@headlessui/react";
import { useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const pages = [
  { name: "Dashboard", href: "#", current: false },
  { name: "Regestration", href: "#", current: true },
];

export default function Users() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [upId, setupId] = useState("");
  const updateStatus = UpdateQeury(`users/status/${upId}`, "user");
  const { data, isLoading } = getQuery("/users", "user");
  const addnew = AddQuery("/users", "user");

  const handleChange = (e, user) => {
    // return console.log(e)
    setupId(user._id);
    if (e === true) {
      const status = "pending";
      updateStatus.mutateAsync({ status: status });
    } else {
      const status = "active";
      updateStatus.mutateAsync({ status: status });
    }
  };
  const addnewstore = async (value) => {

    try {
      addnew
        .mutateAsync(value)
        .then((res) => {
          if (res?.data?.status === true) {
            // messageApi.open({
            //   type: 'success',
            //   content: `${res?.data.message}`,
            // });
            toast.success(res?.data?.message);
            // setOpen(false)
            // formRef.current?.resetFields();
          }
        });
    } catch (error) {
      console.log("err");
    }
    // console.log({...value,permissions:selectedValues})
  };






  return (
    <>
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <HomeIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </a>
            </div>
          </li>
          {pages.map((page) => (
            <li key={page.name}>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <Link
                  to={page.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  aria-current={page.current ? "page" : undefined}
                >
                  {page.name}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <div className="px-4 sm:px-6 lg:px-8 mt-20">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Users List
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all users who can have access to the database
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => {
                // setisupdate(false)
                setOpen(true);
              }}
              className=" ml-4 inline-flex justify-center rounded-md bg-[#4c75ae] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3bb995] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4c75ae]"
            >
              Add user
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      <a href="#" className="group inline-flex">
                        Name
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <a href="#" className="group inline-flex">
                        Email
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <a href="#" className="group inline-flex">
                        Status
                      </a>
                    </th>
                  
                 
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data?.data?.map((user) => (
                    <tr key={user.email}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  text-gray-900 sm:pl-0">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <Switch
                          // checked={user.status=== "active" ? true:false}
                          onChange={(e) => handleChange(e, user)}
                          className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute h-full w-full rounded-md bg-white"
                          />
                          <span
                            aria-hidden="true"
                            className={classNames(
                              user.status === "active"
                                ? "bg-green-500"
                                : "bg-rose-400",
                              "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
                            )}
                          />
                          <span
                            aria-hidden="true"
                            className={classNames(
                              enabled ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
                            )}
                          />
                        </Switch>

                        {user.status == "active" ? (
                          <>
                            <span className="text-green-500 px-3 py-1 rounded-md  bg-green-400/10">
                              {user.status}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-rose-400 px-2 rounded-md py-1 bg-rose-400/10">
                              {user.status}
                            </span>
                          </>
                        )}
                      </td>
                     
                    
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative   z-50" onClose={setOpen}>
          <div className="fixed inset-0 " />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl ">
                    <form
                      onSubmit={handleSubmit(addnewstore)}
                      className="flex  h-full  flex-col divide-y divide-gray-200 bg-white shadow-xl"
                    >
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-[#4c75ae] px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">
                              New User
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="relative rounded-md bg-[#4c75ae] text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setOpen(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-indigo-100">
                              By adding new user fill this form.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="divide-y divide-gray-200 px-4 sm:px-6">
                            <div className="space-y-6 pb-5 pt-6">
                              <div>
                                <label
                                  htmlFor="project-name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Username:
                                </label>
                                <div className="mt-2">
                                  <input
                                    required
                                    type="text"
                                    {...register("name")}
                                    name="name"
                                    placeholder="Username"
                                    id="project-name"
                                    className="block w-full px-2  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="project-name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Email :
                                </label>
                                <div className="mt-2">
                                  <input
                                    required
                                    type="email"
                                    {...register("email")}
                                    name="email"
                                    // placeholder="Blog title"
                                    id="email"
                                    className="block w-full px-2  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor="project-name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  password :
                                </label>
                                <div className="mt-2">
                                  <input
                                    required
                                    type="text"
                                    {...register("password")}
                                    name="password"
                                    // placeholder="Blog title"
                                    id="password"
                                    className="block w-full px-2  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>

                            
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-shrink-0 justify-end px-4 py-4">
                        <button
                          type="button"
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-[#4c75ae] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3bb995] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4c75ae]"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

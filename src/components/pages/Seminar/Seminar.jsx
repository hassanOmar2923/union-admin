import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import { Fragment, useState ,useRef} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon,  } from '@heroicons/react/20/solid'
import { Link } from "react-router-dom";
import { AddQuery, UpdateQeury, deleteFileFromCloudinary, getQuery,DeleteQuery } from "../../shared/ipConfig";
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import Switch from "react-switch";
const pages = [
  { name: "Dashboard", href: "#", current: false },
  { name: "Seminar", href: "#", current: true },
];
import { Skeleton } from "@mui/material";
export default function Seminar() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const { data,isLoading } = getQuery('/seminar', 'seminar');
  const [isupdate, setisupdate] = useState(false);
  const addnew = AddQuery('/seminar','seminar');
  const deletequary = DeleteQuery('/seminar','seminar');
  const [upId, setupId] = useState("");
  const [oldimage, setoldimage] = useState([]);
  const updatequery = UpdateQeury(`/seminar/${upId}`,'seminar');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState([]);
  const [fileSize, setFileSize] = useState(null);
  const handleFileChange = (e) =>{
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      // Check if the selected file type is allowed
      if (!allowedTypes.includes(file.type)) {
        toast.warning('Please select a valid image file (PNG, JPG, JPEG, or SVG).');
        event.target.value = null; // Clear the file input
        return;
      }
        setFileToBase(file);
    } else {
      setFileSize(null);
    }
}

const setFileToBase = (file) =>{
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () =>{
      setImage(reader.result);
  }

}
  const addnewstore = async(value) => {
    // return console.log(image)
     if(oldimage){
      deleteFileFromCloudinary(oldimage)
      setoldimage("")
     }
    if(upId != ""){
      if (image?.length === 0) {
        toast.warning('Please select a course image');
    } else {
        

        const url = 'https://api.cloudinary.com/v1_1/dav4htlfu/image/upload';
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'g64xwxxm');
        formData.append('folder', 'ssi');

          await axios.post(url, formData).then((response)=>{
            // const newImageUrl = response?.data?.secure_url;
            const updatedValues = { ...value, lecturerImg: { public_id:response?.data?.public_id,
              url:response?.data?.url} };
    
            updatequery.mutateAsync(updatedValues).then((res) => {
                if (res?.data?.status === true) {
                  toast.success(res?.data?.message);
                    setOpen(false);
                    setImage('')
                    setupId('')
                }
            });
          })
    
           
    }
    
    }else{

   if(image?.length==0){
    toast.warning('Please select course image')
   }
 
   const formData = new FormData();
   formData.append('file', image);        
   formData.append('upload_preset', 'g64xwxxm'); 
   formData.append('folder', 'ssi')
   const url='https://api.cloudinary.com/v1_1/dav4htlfu/image/upload'
   await axios.post(`${url}`,formData).then((response)=>{
    //  const img={
    //    public_id:response?.data?.public_id,
    //    url:response?.data?.url
    //  }


   const Allvalues={...value,lecturerImg:{public_id:response?.data?.public_id,
    url:response?.data?.url}}
   addnew.mutateAsync(Allvalues).then((res) => {
    if(res.data.status === true){
      // messageApi.open({
      //   type: 'success',
      //   content: `${res?.data.message}`,
      // });
      toast.success(res?.data?.message);
      setOpen(false)
      formRef.current?.resetFields();

    }
  });

  addnew.isError ? console.log(addnew.error) : null;
})

  }
    // console.log(Allvalues);
  };
  const handleupdate=(data)=>{
    setupId(data?._id)
    setisupdate(true)
    setOpen(true)
    setValue('title',data?.title)
    setValue('description',data?.description)
    setValue('lecturer',data?.lecturer)
    setValue('lecturer_desc',data?.lecturer_desc)
    setValue('location',data?.location)
    setValue('Date',data?.Date)
    setValue('cert_Date',data?.cert_Date)
    // setValue('startDate',data?.startDate)
    // setValue('description',data?.description)
    setImage(data?.lecturerImg?.url)
    setoldimage(data.lecturerImg?.public_id)
  }




  const [openDel, setOpenDel] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const handleDelete = () => {
    // return console.log(deleteId)
    if(oldimage){
      deleteFileFromCloudinary(oldimage)
      setoldimage("")
     }
     deletequary.mutateAsync(deleteId).then((res) => {
      toast.success(res?.data?.message);
      setOpenDel(false);
      setDeleteId(null);
    })
    // .catch(err => {
    //   toast.error('Error deleting seminar');
    // });
  };

  // Other state and functions

  const handleOpenDeleteDialog = (data) => {
    setDeleteId(data._id);
    setoldimage(data.lecturerImg?.public_id)
    setOpenDel(true);
  };

    // Toggle user status
    const toggleStatus = async (userId, currentStatus) => {
      try {
        return console.log(userId,currentStatus)
        const newStatus = currentStatus === "active" ? "pending" : "active";
        updateStatus.mutateAsync({ id: userId, status: newStatus }).then((res) => {
          if (res.data.status === true) {
            message.success(res.data.message);
          }
        });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };
  const rows = isLoading ? new Array(5).fill(null) : data?.data || [];
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
<div className="flex justify-end mt-3">

      <button onClick={() => {
        setisupdate(false)
        setOpen(true)
        reset()
        setupId('')
        setImage('')
      }}
      className=" ml-4 inline-flex justify-center rounded-md bg-[#4c75ae] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3bb995] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4c75ae]"
      >Add Course</button>
      </div>
      <div className="text-sm text-[#3bb995] ">Total Seminar : {data?.data?.length}</div>
      {/* model   */}
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
                    <form onSubmit={handleSubmit(addnewstore)} className="flex  h-full  flex-col divide-y divide-gray-200 bg-white shadow-xl">
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-[#4c75ae] px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">
                              New Seminar
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
                              By adding new Seminar fill this form.
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
                                  Seminar Title :
                                </label>
                                <div className="mt-2">
                                  <input
                                  required
                                    type="text"
                                    {...register('title')}
                                    name="title"
                                    placeholder="Seminar title"
                                    id="project-name"
                                    className="block w-full px-2  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                              <div>
                                  <label
                                    htmlFor="Duration"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    Course Date :
                                  </label>
                                  <div className="mt-2">
                                    <input
                                    required
                                      type="text"
                                      name="Date"
                                      {...register('Date')}
                                      placeholder="Example [6/24/2024 10:46 PM]"
                                      id="Date"
                                      className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>
                                <div>
                                <label
                                  htmlFor="project-name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Certeficate Date :
                                </label>
                                <div className="mt-2">
                                  <input
                                  required
                                    type="text"
                                    {...register('cert_Date')}
                                    name="cert_Date"
                                    placeholder="waqtiga kaso muuqan doono shahaadada"
                                    id="project-name"
                                    className="block w-full px-2  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                                <div>
                                  <label
                                    htmlFor="Duration"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    Seminar location :
                                  </label>
                                  <div className="mt-2">
                                    <input
                                    required
                                      type="text"
                                      name="location"
                                      {...register('location')}
                                      placeholder="Example [Shaam Hotel]"
                                      id="Date"
                                      className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>
                             
                             


    <div className="">
      <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700">
        lecturer Image  (  <span className="text-xs text-yellow-500">you can upload only PNG, JPG, JPEG, or SVG</span> )
      </label>
      <div className="mt-4 f">
        <input
        
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
        />
        <label htmlFor="fileInput" className="cursor-pointer bg-white rounded-md font-medium text-[#4c75ae] hover:text-[#3bb995] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#3bb995] px-4 py-2 border border-gray-300">
+ {isupdate ?"update":"upload"} 

        </label>
        {image && (
           <img className="img-fluid mt-4" style={{width:"200px",height:"200px"}} src={image } alt="course image" />
        )}
      </div>
    </div>
    
    <div>
                                  <label
                                    htmlFor="Duration"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    lecturer Name :
                                  </label>
                                  <div className="mt-2">
                                    <input
                                    required
                                      type="text"
                                      name="lecturer"
                                      {...register('lecturer')}
                                      placeholder="Example [Engr. Hassan]"
                                      id="Date"
                                      className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>
    <div>
                                <label
                                  htmlFor="description"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Lecturer Bio
                                </label>
                                <div className="mt-2">
                                  <textarea
                                  {...register('lecturer_desc')}
                                    id="lecturer_desc"
                                    name="lecturer_desc"
                                    rows={2}
                                    placeholder="write about the lecturer"
                                    className="block px-2  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                    defaultValue={""}
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="Summary"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Seminar Summary/description
                                </label>
                                <div className="mt-2">
                                  <textarea
                                  {...register('description')}
                                    id="description"
                                    name="description"
                                    rows={5}
                                    className="block w-full px-2  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                    defaultValue={""}
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
      {/* model end   */}
   
      {/* table   */}
      <div className="mt-8 flow-root">
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-50">
            <tr>
              {/* Table Headers */}
              <th scope="col" className="py-3.5 pl-4 px-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 border-b border-gray-200">
                <a href="#" className="group inline-flex">Seminar</a>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                <a href="#" className="group inline-flex">Description</a>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                <a href="#" className="group inline-flex">Location</a>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                <a href="#" className="group inline-flex">Date</a>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                <a href="#" className="group inline-flex">Lecturer</a>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                <a href="#" className="group inline-flex">Bio</a>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                <a href="#" className="group inline-flex">Actions</a>
              </th>
              {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                <a href="#" className="group inline-flex">Status</a>
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rows.map((user, index) => (
              <tr key={user?._id || index} className="hover:bg-gray-100">
                {/* Table Data Cells */}
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0 border-b border-gray-200">
                  {isLoading ? <Skeleton width="100%" /> : user.title}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0 border-b border-gray-200">
                  {isLoading ? <Skeleton width="100%" /> : user.description}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0 border-b border-gray-200">
                  {isLoading ? <Skeleton width="100%" /> : user.location}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0 border-b border-gray-200">
                  {isLoading ? <Skeleton width="100%" /> : user.Date}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0 border-b border-gray-200">
                  {isLoading ? (
                    <Skeleton variant="circular" width={32} height={32} />
                  ) : (
                    <>
                      <img className="inline-block h-8 w-8 rounded-full mr-2" src={user.lecturerImg?.url} alt="" />
                      {user.lecturer}
                    </>
                  )}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0 border-b border-gray-200">
                  {isLoading ? <Skeleton width="100%" /> : user.lecturer_desc}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0 border-b border-gray-200">
                  {isLoading ? (
                    <Skeleton width={40} />
                  ) : (
                    <>
                      <button onClick={() => handleOpenDeleteDialog(user)} className="text-red-500 hover:text-red-700">
                        <DeleteIcon />
                      </button>
                      <button onClick={() => handleupdate(user)} className="text-blue-500 hover:text-blue-700 ml-2">
                        <CreateIcon />
                      </button>
                    </>
                  )}
                </td>
                {/* <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0 border-b border-gray-200">
                  {isLoading ? (
                    <Skeleton width="100%" />
                  ) : (
                    <Switch
                      onChange={(checked) => toggleStatus(user._id, checked)}
                      checked={user.status}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      onColor="#00C853"
                      offColor="#FF5252"
                    />
                  )}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
      
{/* dilog for adding techer */}
<Dialog className="relative z-10" open={openDel} onClose={() => setOpenDel(false)}>
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                Delete Seminar
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this seminar? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={() => setOpenDel(false)}
          >
            Cancel
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </div>
</Dialog>
    </>
  );
}

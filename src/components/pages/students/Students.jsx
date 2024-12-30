import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon } from '@heroicons/react/20/solid';
import { Link } from "react-router-dom";
import { AddQuery, UpdateQeury, DeleteQuery, getQuery } from "../../shared/ipConfig";
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import axios from "axios";
import { Upload, Button, Modal, message, Select, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { Skeleton } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
const pages = [
  { name: "Dashboard", href: "#", current: false },
  { name: "Students", href: "#", current: true },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
  }
export default function Students() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [dataForDownload, setDataForDownload] = useState([]);
  const [showData, setshowData] = useState([]);
  const { data, isLoading } = getQuery('/ssi', 'ssi');
  const { data: seminar } = getQuery('/seminar', 'seminar');
  const [isupdate, setisupdate] = useState(false);
  const addnew = AddQuery('/ssi/postAdmin', 'ssi');
  const createMany = AddQuery('/ssi/createMany', 'ssi');
  const deletequary = DeleteQuery('/ssi', 'ssi');
  const deleteMany = DeleteQuery('/ssi/deleteBySem', 'ssi');
  const [upId, setupId] = useState("");
  const updatequery = UpdateQeury(`/ssi/${upId}`, 'ssi');
  const [open, setOpen] = useState(false);

  const addnewstore = async (value) => {
    if (upId !== "") {
      updatequery.mutateAsync(value).then((res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message);
          setOpen(false);
          setupId('');
        }
      });
    } else {
      addnew.mutateAsync(value).then((res) => {
        if (res.data.status === true) {
          toast.success(res?.data?.message);
          setOpen(false);
          formRef.current?.resetFields();
        }
      });
      if (addnew.isError) console.log(addnew.error);
    }
  };

  const handleupdate = (data) => {
    setupId(data?._id);
    setisupdate(true);
    setOpen(true);
    setValue('Name', data?.Name);
    setValue('Gander', data?.Gander);
    setValue('number', data?.number);
    setValue('seminarId', data?.seminarId._id);
  };

  const [openDel, setOpenDel] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = () => {
    deletequary.mutateAsync(deleteId).then((res) => {
      toast.success(res?.data?.message);
      setOpenDel(false);
      setDeleteId(null);
    });
  };

  const handleOpenDeleteDialog = (data) => {
    setDeleteId(data._id);
    setOpenDel(true);
  };

  const rows = isLoading ? new Array(5).fill(null) : showData || [];

  const [openUpload, setOpenUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      setSelectedFile(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileSubmit = async () => {
    if (!selectedFile || !selectedSeminar) {
      return message.error('Please select a file & seminar')
    };
    setUploading(true);
    let arr=[]
    selectedFile.map((std) => {
      let obj={
        seminarId: selectedSeminar,
        'Serial Number':std['Serial Number'],
        Name:std.Name,
        'Phone number':std['Phone number'],
        Gander:std.Gander,
      }
      arr.push(obj);
    })
   
    try {
      createMany.mutateAsync(arr).then((res) => {
        if (res.data.status === true) {
          toast.success(res?.data?.message);
          setOpen(false);
          formRef.current?.resetFields();
          setOpenUpload(false);
        }
      });
      if (createMany.isError) console.log(addnew.error);
    } catch (error) {
      // toast.error("Failed to upload file");
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const [selectedSeminar, setSelectedSeminar] = useState('');
  const [openDelBySeminar, setOpenDelBySeminar] = useState(false);
  const [selectSemIdToDel, setselectSemIdToDel] = useState('');

  const handleDeleteBySeminar = async () => {
    if (!selectSemIdToDel) {
      return message.error('Please select a seminar');
    }
    try {
      deleteMany.mutateAsync(selectSemIdToDel).then((res) => {
        toast.success(res?.data?.message);
        setOpenDel(false);
        setDeleteId(null);
      });
      setOpenDelBySeminar(false);
      setselectSemIdToDel('')
    } catch (error) {
      toast.error("Failed to delete students");
    }
  };
const handleAdd=() => {
  setisupdate(false);
  setOpen(true);
  reset();
  setupId('');
}

const buttons = [
  { name: 'Add Student', icon: AddCircleIcon, onClick: () => handleAdd(),color: 'bg-blue-400', hoverColor: 'hover:bg-blue-500', },
  { name: 'Upload Student', icon: CloudUploadIcon, onClick: () =>  setOpenUpload(true),color: 'bg-green-400', hoverColor: 'hover:bg-green-500', },
  { name: 'Delete Many', icon: DeleteSweepIcon, onClick: () =>setOpenDelBySeminar(true),color: 'bg-red-500', hoverColor: 'hover:bg-red-600', },
  { name: 'Save as Excel', icon: CloudDownloadIcon, onClick: () => downloadAllData(),color: 'bg-green-400', hoverColor: 'hover:bg-green-500', },
  ]



  useEffect(() => {
    if (data) {
      const formattedData = data?.data?.map(item => ({
        Name: item.Name,
        Gander: item.Gander,
        'Phone number': item.number,
        'Serial Number': item.Number,
        seminar:item.seminarId?.title
        // Email: item.Email,
      }));
      setDataForDownload(formattedData);
      setshowData(data?.data)
    }
  }, [data]);
  const downloadAllData = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataForDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "table_data.xlsx", { bookType: 'xlsx' });
};
const option = [{
  value: 'All',
  label:'All'
}];
seminar?.data?.map((item) => {
  option.push({
    value: item._id,
    label: item.title,
  });
});

const [form] = Form.useForm();
const handleChange = async (value) => {
  if(value === "all"){
    setDataForDownload(data?.data)
    setshowData(data?.data)
  }else{


  const filter=data?.data?.filter((item)=>item.seminarId?._id === value)
  setshowData(filter)
  const formattedData = filter?.map(item => ({
    Name: item.Name,
    Gander: item.Gander,
    'Phone number': item.number,
    'Serial Number': item.Number,
    seminar:item.seminarId?.title
    // Email: item.Email,
  }));
  setDataForDownload(formattedData)
  }
  // console.log(value)
};
  return (
    <>
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </a>
            </div>
          </li>
          {pages.map((page) => (
            <li key={page.name}>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
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
      <div>
    
    <div className=" my-5">
    <nav aria-label="Buttons" className="isolate flex divide-x divide-gray-200 rounded-lg shadow">
        {buttons.map((button, buttonIdx) => (
          <button
            key={button.name}
            onClick={button.onClick}
            className={classNames(
              button.color,
              button.hoverColor,
              `text-white  hover:bg-indigo-700`,
              buttonIdx === 0 ? 'rounded-l-lg' : '',
              buttonIdx === buttons.length - 1 ? 'rounded-r-lg' : '',
              'group relative min-w-0 flex-1 overflow-hidden px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 flex items-center justify-center space-x-2',
            )}
          >
            <button.icon className=" " aria-hidden="true" />
            <span className="text-sm">{button.name}</span>
            {/* <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500"
            /> */}
          </button>
        ))}
      </nav>
    </div>
    <Form.Item
              label={<h2>Filter with Seminar</h2>}
              name='seminarId'
              // initialValue=""
              // rules={[
              //   {
              //     required: true,
              //   },
              // ]}
            >
              <Select
              showSearch
              defaultValue={option[0].value}
              // value={}
              optionFilterProp="children"
                           filterOption={(input, option) => (option?.label ?? '').includes(input)}
                           filterSort={(optionA, optionB) =>
                             (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                           }
               onChange={handleChange} options={option} />
            </Form.Item>
  </div>
      {/* <div className="flex justify-end mt-3">
        <button onClick={() => {
          setisupdate(false);
          setOpen(true);
          reset();
          setupId('');
        }} className=" ml-4 inline-flex justify-center rounded-md bg-[#4c75ae] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3bb995] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4c75ae]">
          Add Student
        </button>
        <button onClick={() => setOpenUpload(true)} className=" ml-4 inline-flex justify-center rounded-md bg-[#4c75ae] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3bb995] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4c75ae]">
          Upload Students
        </button>
      </div> */}
      <div className="text-sm text-[#3bb995]">Total Students: {showData?.length}</div>
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
                              New Student
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
                              By adding new Student fill this form.
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
                                  Name :
                                </label>
                                <div className="mt-2">
                                  <input
                                  required
                                    type="text"
                                    {...register('Name')}
                                    name="Name"
                                    placeholder="Name"
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
                                    Phone:
                                  </label>
                                  <div className="mt-2">
                                    <input
                                    required
                                      type="text"
                                      name="number"
                                      {...register('number')}
                                      placeholder="phone number"
                                      id="number"
                                      className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>
                                <div>
      <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
        Gender :
      </label>
      <select
        id="Gander"
        name="Gander"
        {...register('Gander')}
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        // defaultValue="Canada"
      >
        <option>male</option>
        {/* <option>Male</option> */}
        {/* <option>Female</option> */}
        <option>female</option>
      </select>
    </div>
    <div>
      <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
        Seminar :
      </label>
      <select
        id="seminarId"
        name="seminarId"
        {...register('seminarId')}
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        // defaultValue="Canada"
      >
        {seminar?.data?.map((sem)=>{
          return <option value={sem._id}>{sem.title}</option>
        })}
      </select>
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

      <Modal
        title="Upload Students"
        visible={openUpload}
        onCancel={() => setOpenUpload(false)}
        onOk={handleFileSubmit}
        confirmLoading={uploading}
        okButtonProps={{ style: { background: '#1862AD', } }}
      >
        <div className="my-5">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Select Seminar
          </label>
          <select
            value={selectedSeminar}
            onChange={(e) => setSelectedSeminar(e.target.value)}
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option value="">Select a seminar</option>
            {seminar?.data?.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.title}
              </option>
            ))}
          </select>
        </div>
        {/* <br/> */}
        <Upload
         
  accept=".xlsx, .xls"
  beforeUpload={(file) => {
    handleUpload({ file });
    return false;
  }}
  onRemove={() => setSelectedFile(null)}
  maxCount={1}
>
  <Button 

    icon={<UploadOutlined />} 
  >
    Select File
  </Button>
</Upload>

      </Modal>
      <div className="flex flex-col mt-5">
        <div className="overflow-x-auto">
          <div className="min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket No.</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.Number</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seminar</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows?.map((row, index) => (
                    <tr key={row?._id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row?.no  || <Skeleton />}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row?.Name || <Skeleton />}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row?.Gander || <Skeleton />}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row?.number || <Skeleton />}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row?.Number || <Skeleton />}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row?.seminarId?.title || <Skeleton />}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleupdate(row)} className="text-[#4c75ae] hover:text-[#3bb995]"><CreateIcon /></button>
                        <button onClick={() => handleOpenDeleteDialog(row)} className="ml-2 text-[#4c75ae] hover:text-[#3bb995]"><DeleteIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows?.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No students found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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



{/* <button onClick={()=>setOpenDelBySeminar(true)}>
  delete
</button> */}
<Dialog className="relative z-10" open={openDelBySeminar} onClose={() => setOpenDelBySeminar(false)}>
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
              Delete Students with This specific Seminar
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                Are you sure you want to delete these students? This action cannot be undone.
                </p>
                <div className="my-5">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Select Seminar
          </label>
          <select
            value={selectSemIdToDel}
            onChange={(e) => setselectSemIdToDel(e.target.value)}
            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#4c75ae] sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option value="">Select a seminar</option>
            {seminar?.data?.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.title}
              </option>
            ))}
          </select>
        </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={handleDeleteBySeminar}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={() => setOpenDelBySeminar(false)}
          >
            Cancel
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </div>
</Dialog>
      {/* //delete with seminar id  */}

    </>
  );
}




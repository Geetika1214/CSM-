
const Checkbox = ({ label }) => {
  return (
    <div className=" flex items-center space-x-2 p-3 ">
      <input 
      type="checkbox"
      className="w-4 h-4 text-slate-700 bg-white-100
       rounded border-gray-300 focus:ring-slate-700"
       />
       <label className="text-sm text-blue-900 font-semibold">{label}</label>
    </div>
  )
}

export default Checkbox;

import { useController } from "react-hook-form"
import Select from 'react-select'
import { Editor } from '@tinymce/tinymce-react';

export const TextInputComponent = ({type="text",control,name, defaultValue="",required=false, errMsg= null,placeholder="",className="",style={}}: {type:string,control:any,name:string, defaultValue:string,required:boolean, errMsg:string|null,placeholder:string,className:string,style:React.CSSProperties})=>{
    const {field} = useController({
        control:control,
        name:name,
        defaultValue:defaultValue,
        // rules:{
        //     required:required
        // }
    })
    return (
        <>
            <input
                type={type}
                {...field} 
                placeholder={placeholder}
                className={className}
                style={style}
            /> <br />
            <span style={{color:'red', fontStyle:'italic'}}>
                {errMsg}
            </span>
        </>
    )

}
export const TextAreaInput = ({control,name, defaultValue="",required=false, errMsg= null,row=5,placeholder="",className="",style={}}: {control:any,name:string, defaultValue:string,required:boolean, errMsg:string|null,row:number,placeholder:string,className:string,style:React.CSSProperties})=>{
    const {field} = useController({
        control:control,
        name:name,
        defaultValue:defaultValue,
        // rules:{
        //     required:required
        // }
    })
    return (
        <>
            <textarea  rows={row} {...field}
                placeholder={placeholder}
                className={className}
                style={style}
            >
                {defaultValue}                
            </textarea><br />
            <span style={{color:'red', fontStyle:'italic'}}>
                {errMsg}
            </span>
        </>
    )
}
export const DescriptionInput = ({ type = "text", control, name, defaultValue = "",  errMsg = null,}: {type:string,control:any,name:string, defaultValue:string,required:boolean, errMsg:string|null}) => {
    const { field } = useController({
        control:control,
        name:name,
        defaultValue: defaultValue,
        // rules: { required },
    });
    const handleEditorChange = (content: string) => {
        field.onChange(content); // Update the form value in React Hook Form
    };
    

    return (
        <>           
            <Editor
                apiKey="yuzlcp10h3jo0z3gne1gkc2fubxfufx3q1jp5q041aqu0qgg"
                init={{
                height: 150,
                menubar: false,
                plugins: ['link', 'table', 'lists', 'image'],
                toolbar:
                    'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image',
                }}
                
                value={field.value || ""}
                onEditorChange={handleEditorChange}
            />
            
            <br />
            {errMsg && <span style={{ color: 'red', fontStyle: 'italic' }}>{errMsg}</span>}
        </>
    );
};

export const SelectComponent = ({options,control,name,defaultValue,errMsg,required=false}: {options:any,control:any,name:string,defaultValue:string,errMsg:string|null,required:boolean})=>{
    const {field} = useController({
        control:control,
        name:name,
        defaultValue:defaultValue,
        // rules:{
        //     required:required
        // }
    })

    return (
        <>
            <Select options={options} {...field} isClearable menuPlacement='top'/>
            <span style={{color:'red', fontStyle:'italic'}}>
                {errMsg}
            </span>
        </>
    )
}
export const OptionsComponent = ({control,name,errMsg,required,defaultValue}: {control:any,name:string,errMsg:string|null,required:any,defaultValue:string})=>{
    return(
        <>
            <SelectComponent 
                options ={
                    [{label:"True", value:"true"},{label:"False", value:"false"}]
                }
                control={control}
                name={name}
                errMsg={errMsg}
                defaultValue={defaultValue}
                required={required}
            />
        </>
    )
}
export const ProjectCategoryComponent = ({control,name,errMsg,required,defaultValue}: {control:any,name:string,errMsg:string|null,required:any,defaultValue:string})=>{
    return(
        <>
            <SelectComponent 
                options ={
                    [{label:"Web Development", value:"Web Development"},{label:"Mobile Apps", value:"Mobile Apps"},{label:"UI-UX", value:"UI-UX"},{label:"E-Commerce", value:"E-Commerce"},{label:"Custom Systems", value:"Custom Systems"}]
                }
                control={control}
                name={name}
                errMsg={errMsg}
                defaultValue={defaultValue}
                required={required}
            />
        </>
    )
}


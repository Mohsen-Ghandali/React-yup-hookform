import "./Create.css"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react"; // Import useState

const Create = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [confirm,setConfirm]=useState(false)
    const schema = yup.object().shape({
        title: yup
            .string()
            .required("This field is required")
            .min(5, "Minimum 5 characters")
            .max(16, "Maximum 16 characters"),
        body: yup
            .string()
            .required("This field is required")
            .min(5, "Minimum 5 characters")
            .max(50, "Maximum 50 characters")
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [isButtonDisabled, setButtonDisabled] = useState(false); // Initialize button state

    const create = async (data) => {
        try {
            setButtonDisabled(true); // Disable the button during submission
            let response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title: data.title,
                    body: data.body,
                    userId: 1,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            let res = await response.json();
            console.log(res);
            reset();
            setButtonDisabled(false); // Re-enable the button after successful submission
            setConfirm(true)
            setTimeout(() => {
                setConfirm(false)
            }, 3000);
        } catch (error) {
            setError(error.message);
            setLoading(true);
            setButtonDisabled(false); // Re-enable the button after an error
        }
    }

    return (
        <>
            <h3 className="text-center mt-4 ">Create a Post</h3>

            {loading && <div className="text-center"><span className="spinner-border spinner-border-sm text-danger mt-3" ></span></div>}

            {error && <div className="text-center"><p className="text-danger">{error}</p></div>}

            {confirm && <div className="text-center"><p className="text-danger">Post 101 was created successfully ✔️</p></div>}

            <div className="create container mx-auto mt-3">
                <div className="row">
                    <div className="col-6 offset-3 bg-dark p-5 my-3 text-white">
                        <form onSubmit={handleSubmit(create)}>
                            <div className="d.block mb-4">
                                <label htmlFor="title" className="mb-1">Title:</label>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="form-control"
                                    {...register("title")}
                                />
                                <p className="text-warning">{errors.title?.message}</p>
                            </div>
                            <div className="d.block">
                                <label htmlFor="body" className="mb-1">Body:</label>
                                <textarea
                                    placeholder="Body"
                                    className="form-control"
                                    {...register("body")}
                                />
                                <p className="text-warning">{errors.body?.message}</p>
                            </div>
                            <div className="d-block text-center mt-3">
                                <button
                                    className="btn btn-primary text-capitalize mt-4"
                                    disabled={isButtonDisabled} // Disable the button based on the state
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Create;

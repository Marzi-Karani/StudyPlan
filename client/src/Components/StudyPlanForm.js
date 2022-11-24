import 'bootstrap/dist/css/bootstrap.min.css'
import {StudyPlanTable} from './StudyPlanTable'
import {Form, Row , Col , Button} from 'react-bootstrap'
import { useState } from "react";
import DeleteConfirmation from "./DeleteConfirmation"

function StudyPlanForm(props)
{

    const [type,setType]=useState(props.studyPlan ? props.studyPlan.type : 'FullTime')
    const [minCredit,setMinCredit]=useState(props.studyPlan ? props.studyPlan.minCredit :60)
    const [maxCredit,setMaxCredit]=useState(props.studyPlan ? props.studyPlan.maxCredit :80)
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    //const [totallCredit]=useState(props.sumCredit)

    function onChangeValue(event) {
        setType(event.target.value);

        switch (event.target.value){
            case ("FullTime"):
                {
                    setMinCredit(60)
                    setMaxCredit(80)
                    break
                }
            case ("PartTime") :
                {
                    setMinCredit(20)
                    setMaxCredit(40)
                    break
                }
            default :
                break 
      }
    }

      const handleSubmit=(event)=>
      {
        event.preventDefault();

          const studyPlan = {type:type,minCredit:minCredit,maxCredit:maxCredit,totalCredit:props.sumCredit}

          if(props.studyPlan!=null)
          {
            props.updateStudyPlan(studyPlan)
          }
               
          else
                props.addStudyPlan(studyPlan)
      }


  
      // Handle the displaying of the modal based on type and id
      const showDeleteModal = () => {
  
          setDeleteMessage(`Are you sure you want to delete your study plan?`);
  
          setDisplayConfirmationModal(true);
      };
  
      // Hide the modal
      const hideConfirmationModal = () => {
          setDisplayConfirmationModal(false);
      };

      const handleDelete=()=>
      {
          props.deleteStudyPlan()
          setDisplayConfirmationModal(false);     
      }

      const handleCancel=()=>
      {
          props.setShowColor(false)
          props.getStudyPlan()  
      }

    return(
        <>
        <Form className="justify-content-md-center block-example border border-secondary rounded form-padding" onSubmit={handleSubmit}>
        <Row className="mb-3 ms-5 mt-2">
        <Form.Group as={Col} className='col-md-1' >
        <Form.Check custom="true" type="radio" label="FullTime" name="FullTime" value="FullTime" checked={type === "FullTime"} disabled={props.studyPlan} onChange={onChangeValue} />
        </Form.Group>
        <Form.Group as={Col} className='col-md-1'>
        <Form.Check custom="true" type="radio" label="PartTime" name="PartTime" value="PartTime" checked={type === "PartTime"} disabled={props.studyPlan} onChange={onChangeValue} />
        </Form.Group>
        </Row>
        
            <Row  className="mb-3  ms-5 me-2">
            <Form.Group as={Col} >
        <Form.Label>Min Credit :</Form.Label>
        <Form.Control type="text"  size="sm" className='plaintext' readOnly value={minCredit} />
      </Form.Group>

      <Form.Group as={Col} >
        <Form.Label>Max Credit :</Form.Label>
        <Form.Control type="text" size="sm" className='plaintext' readOnly value={maxCredit} />
      </Form.Group>
      <Form.Group as={Col} >
        <Form.Label>Sum of Credits :</Form.Label>
        <Form.Control type="text" size="sm" className='plaintext' readOnly value={props.sumCredit} />
      </Form.Group>
            </Row>
            <Row className=' ms-5'>
                <Col>
                <Button size='sm' type='submit' variant='success'>submit</Button>&nbsp;
                <Button size='sm'  variant='primary' onClick={handleCancel}>cancel</Button>&nbsp;
              {props.studyPlan ?<Button size='sm' variant='danger' onClick={() => showDeleteModal()}>delete</Button> : null}  
              <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={handleDelete} hideModal={hideConfirmationModal} message={deleteMessage} />
                </Col>
            </Row>
           
            
<Row className="justify-content-md-center p-5" >
<Col>
<StudyPlanTable studyPlanCourses={props.studyPlanCourses} removeCourse={props.removeCourse} errMessage={props.errMessage}  showColor={props.showColor} delErrMessage={props.delErrMessage}></StudyPlanTable>

</Col>
</Row>
            </Form>

</>
    )
  
}


export {StudyPlanForm}


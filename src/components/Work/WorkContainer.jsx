import React from "react";
import { connect } from "react-redux";
import { getWorks, getWorksLoading } from "../../redux/works-selector";
import { requestWorks } from "../../redux/works-reducer";
import Preloader from "../../common/Preloader";

class WorkContainer extends React.Component {
    componentDidMount() {
        this.props.requestWorks(1, 1);
    }
    render() {
        if (this.props.isWorksLoading)
            return <Preloader />

        if (this.props.works.length === 0)
            return <h1>No works yet!</h1>

        const worksElements = this.props.works.map((work, index) => <div key={index}>{work.content_path}</div>)

        return (
            <div>
                {worksElements}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        works: getWorks(state),
        isWorksLoading: getWorksLoading(state),
    }
}


export default connect(mapStateToProps, { requestWorks })(WorkContainer);
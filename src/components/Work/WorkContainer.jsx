import React from "react";
import { connect } from "react-redux";
import { getWorks, getWorksLoading } from "../../redux/works-selector";
import { requestWorks } from "../../redux/works-reducer";
import Preloader from "../../common/Preloader";
import Work from "./Work";
import MyPagination from "../../common/Pagination";

class WorkContainer extends React.Component {
    componentDidMount() {
        this.props.requestWorks(1, 1);
    }
    render() {
        if (this.props.isLoading)
            return <Preloader />

        if (this.props.works.length === 0)
            return <h1>No works yet!</h1>

        const worksElements = this.props.works.map((work, index) => <Work key={index} {...work} />)

        return (
            <div>
                <MyPagination />
                {worksElements}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        works: getWorks(state),
        isLoading: getWorksLoading(state),
    }
}


export default connect(mapStateToProps, { requestWorks })(WorkContainer);
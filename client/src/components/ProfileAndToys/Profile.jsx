/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

// Import materialui info
import { makeStyles, styled } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ClearIcon from '@material-ui/icons/Clear';
// import { borders } from '@material-ui/system';

// Import components & css
// import ToyBox from './ToyBox';
import Navbar from './Navbar';
// import Toast from './Snackbar';
import './Profile.css';

// Import axios
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
  media: {
    paddingTop: '81.25%',
    borderRadius: '50%',
    margin: '28px',

  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  card: {
    height: 'auto',
    maxWidth: '30vw',
    flexDirection: 'row',
    backgroundColor: '#FEFDFF',
    breakInside: 'avoid',
    fontFamily: 'Roboto',
    marginBottom: '20px',
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const Profile = ({ dogs, getDogs }) => {
  // const [expanded, setExpanded] = useState(false);
  // const [isClicked, setisClicked] = useState({});

  const history = useHistory();
  const classes = useStyles();

  const handleExpandClick = () => {
    // if (!isClicked[ID]) {
    //   isClicked[ID] = false;
    // } else {
    //   isClicked[ID] = !isClicked[ID];
  };

  const deleteDog = (dog) => {
    // eslint-disable-next-line no-underscore-dangle
    const dogID = dog._id;
    axios.delete(`data/dog${dogID}`)
      .then((response) => {
        console.info(response);
        getDogs();
      }).catch((err) => {
        console.warn(err);
      });
  };

  const deleteToy = (dog, toy) => {
    // eslint-disable-next-line no-underscore-dangle
    axios.delete(`data/toy${dog._id}`, { data: { data: toy } })
      .then(() => {
        getDogs();
      }).catch((err) => {
        console.warn(err);
      });
  };

  const MyButton = styled(Button)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    width: 300,
    padding: '0 30px',
  });

  useEffect(() => {
    getDogs();
    // console.log(dogs);
  }, []);

  return (
    <div className="Profile">
      <Navbar />
      <div
        className="dogProfile"
        style={{
          width: '100%', height: '100%', paddingBottom: '10px', columnCount: '3',
        }}
      >
        {dogs.map((dog) => (
          <Card
            className={classes.card}
          >
            <CardHeader
              title={dog.name}
              action={(
                <IconButton aria-label="delete dogs">
                  <DeleteIcon onClick={() => deleteDog(dog)} />
                </IconButton>
              )}
            />
            <CardMedia
              className={classes.media}
              image={dog.image}
            />
            <CardActions disableSpacing>
              <h3>{`${dog.name}'s Toys`}</h3>
              <IconButton
                className={clsx(classes.expand, {
                  // [classes.expandOpen]: expanded,
                })}
                onClick={() => { handleExpandClick(dog._id); }}
                // aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse timeout="auto" unmountOnExit>
              <CardContent>
                {dog.toys && dog.toys.map((toys) => (
                  <div>
                    <h3><a href={toys.link}>{toys.name}</a></h3>
                    <p>{toys.link}</p>
                    <IconButton aria-label="add to favorites">
                      <ClearIcon onClick={() => {
                        deleteToy(dog, toys);
                      }}
                      />
                    </IconButton>
                  </div>
                ))}
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </div>
      <div
        style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}
      >
        <MyButton onClick={() => { history.push('/form'); }}>Add Dog</MyButton>
      </div>
    </div>
  );
};

Profile.propTypes = {
  dogs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    breed: PropTypes.string,
    image: PropTypes.string,
    size: PropTypes.string,
    toys: PropTypes.arrayOf,
  })).isRequired,
  getDogs: PropTypes.func.isRequired,
};

export default Profile;

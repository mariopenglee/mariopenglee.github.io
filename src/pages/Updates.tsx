import "./Updates.css";
import updatesRaw from "../data/updates.json";
import { motion } from "framer-motion";

interface UpdateItem {
	date: string;
	title: string;
	desc: string;
}

const updates: UpdateItem[] = updatesRaw as UpdateItem[];

export default function Updates() {
	const pageVariants = {
		initial: {
			opacity: 0,
			y: 40,
			scale: 0.98,
			filter: "blur(8px)",
			transition: {
				duration: 0.5,
				ease: [0.4, 0, 0.2, 1],
			},
		},
		in: {
			opacity: 1,
			y: 0,
			scale: 1,
			filter: "blur(0px)",
			transition: {
				duration: 0.7,
				ease: [0.4, 0, 0.2, 1],
			},
		},
		out: {
			opacity: 0,
			y: -40,
			scale: 0.98,
			filter: "blur(8px)",
			transition: {
				duration: 0.5,
				ease: [0.4, 0, 0.2, 1],
			},
		},
	};
	const pageTransition = {
		type: "tween",
		ease: [0.4, 0, 0.2, 1],
		duration: 0.7,
	};
	return (
		<motion.div
			className="page-content"
			initial="initial"
			animate="in"
			exit="out"
			variants={pageVariants}
			transition={pageTransition}
		>
			<div id="updates">
				<h1
					style={{
						fontWeight: 700,
						fontSize: "2.4rem",
						marginBottom: "2.2rem",
						letterSpacing: "-0.01em",
						textAlign: "left",
						lineHeight: 1.1,
						display: "inline-block",
					}}
				>
					monthly{" "}
					<span
						style={{
							background:
								"linear-gradient(90deg, #007aff 0%, #b16cea 50%, #ff6bcb 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
							display: "inline-block",
						}}
					>
						Updates 🚀
					</span>
				</h1>
				<div className="timeline">
					{updates.map((item, idx) => (
						<div className="timeline-node animatable" key={idx}>
							<div className="timeline-date-col">
								<span className="timeline-date-text">{item.date}</span>
							</div>
							<div className="timeline-content">
								<div className="timeline-title">{item.title}</div>
								<div className="timeline-desc">{item.desc}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);
}
